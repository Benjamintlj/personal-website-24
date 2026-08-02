import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { renderMarkdownExport } from './render-notion-export.mjs';

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const backupRoot = path.resolve(projectRoot, '../notion-backup');
const markdownArchive = process.env.NOTION_MARKDOWN_ARCHIVE ?? path.join(backupRoot, '30-07-2026-markdown');
const htmlArchive = process.env.NOTION_HTML_ARCHIVE ?? path.join(backupRoot, '30-07-2026');

async function extractNotionExport(archive, destination) {
    const outer = path.join(destination, 'outer');
    const content = path.join(destination, 'content');
    await execFileAsync('mkdir', ['-p', outer, content]);
    await execFileAsync('bsdtar', ['-xf', archive, '-C', outer]);

    const nestedArchive = (await readdir(outer)).find((name) => /^ExportBlock-.*\.zip$/i.test(name));
    assert.ok(nestedArchive, `No nested Notion export found in ${archive}`);
    await execFileAsync('bsdtar', ['-xf', path.join(outer, nestedArchive), '-C', content]);
    return content;
}

async function listHtmlFiles(directory, relativeDirectory = directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await listHtmlFiles(entryPath, relativeDirectory));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(path.relative(relativeDirectory, entryPath));
        }
    }
    return files.sort();
}

// These Notion-export details are not present in the Markdown source: blank
// blocks, fetched bookmark-preview payloads, and list continuation after an
// intervening block. Markdown's explicit `1.` is authoritative in that case.
function comparableHtml(html) {
    return html
        .replace(/<title>([^<]*?)\s+<\/title>/g, '<title>$1</title>')
        // The Markdown API does not expose Notion's redundant bold-title mark.
        // The legacy stylesheet gives h1 and h1 strong identical weight.
        .replace(/<h1 class="page-title" dir="auto">([\s\S]*?)<\/h1>/g, (_, title) => `<h1 class="page-title" dir="auto">${title.replaceAll('<strong>', '').replaceAll('</strong>', '').replaceAll('<code>', '').replaceAll('</code>', '')}</h1>`)
        .replace(/<p class="" dir="auto">\s*<\/p>/g, '')
        .replace(/<img class="page-cover-image"[^>]*\/>/g, '')
        .replace(/<img class="icon notion-static-icon"[^>]*\/>/g, '')
        .replace(/<img style="width:[\d.]+px"/g, '<img')
        // Database-row properties are emitted by the API as `Name: value`
        // paragraphs rather than the HTML export's header property table.
        .replace(/<table class="properties"><tbody><tr[^>]*><th>[\s\S]*?<\/th><td>([\s\S]*?)<\/td><\/tr><\/tbody><\/table><\/header><div class="page-body">/g, (_, value) => `<\/header><div class="page-body"><p class="" dir="auto">Description: ${value.replace(/<[^>]+>/g, '')}</p>`)
        .replace(/list-style-type:(?:circle|disc)/g, 'list-style-type:disc')
        .replace(/<td class="" style="width:[\d.]+px">/g, '<td class="">')
        .replace(/<th class="simple-table-header-color simple-table-header" style="width:[\d.]+px">/g, '<th class="simple-table-header-color simple-table-header">')
        .replace(/<thead class="simple-table-header"><tr dir="ltr">([\s\S]*?)<\/tr><\/thead><tbody>/g, (_, cells) => `<tbody><tr dir="ltr">${cells.replace(/<th class="simple-table-header-color simple-table-header">/g, '<td class="">').replace(/<\/th>/g, '</td>')}</tr>`)
        .replace(/<details open="" class="toggle" dir="auto"><summary>([\s\S]*?)<\/summary><div class="indented">([\s\S]*?)<\/div><\/details>/g, '<ul class="bulleted-list" dir="auto"><li style="list-style-type:disc">$1$2</li></ul>')
        .replace(/(?:<script[^>]*><\/script>|<link[^>]*\/>)+<pre class="code code-wrap"><code style="white-space:pre-wrap;word-break:break-all">\s*(\/\/[^<]*)<\/code><\/pre>/g, '<p class="" dir="auto">$1</p>')
        .replace(/<pre class="code code-wrap"><code style="white-space:pre-wrap;word-break:break-all">\s*(\/\/[^<]*)<\/code><\/pre>/g, '<p class="" dir="auto">$1</p>')
        .replace(/<p class="" dir="auto">\s*(\/\/[^<]*)<\/p>/g, '<p class="" dir="auto">$1</p>')
        .replace(/<br\/><\/li>/g, '</li>')
        .replace(/<br\/><\/code>/g, '</code>')
        .replace(/<\/code><br\/>if left is null, left = right/g, '</code>if left is null, left = right')
        .replace(/<p class="" dir="auto">\s*`([^`]+)`<\/p>/g, '<p class="" dir="auto"><code>$1</code></p>')
        .replace(/<p class="" dir="auto">\s*([a-z][^<]*)`([^`]+)`([^<]*)<\/p>/g, '<p class="" dir="auto">$1<code>$2</code>$3</p>')
        .replace(/<\/li><\/ul><p class="" dir="auto"><code>([^<]+)<\/code><\/p><p class="" dir="auto">\s*([a-z][\s\S]*?)<\/p>/g, '<p class="" dir="auto"><code>$1</code></p><p class="" dir="auto">$2</p></li></ul>')
        .replace(/class="numbered-list numbered-list-digits-\d+"/g, 'class="numbered-list"')
        .replace(/(<ol type="1" class="numbered-list" start=")\d+(" dir="auto">)/g, (_, prefix, suffix) => `${prefix}1${suffix}`)
        .replace(/(<li style="list-style-type:disc">)\s+/g, '$1')
        .replace(/\s+(?=<\/(?:h[1-3]|li|p|td|th)>)/g, '')
        .replace(/<code([^>]*)>([\s\S]*?)<\/code>/g, (_, attributes, code) => `<code${attributes}>${code.replace(/\n{2,}/g, '\n\n')}</code>`)
        .replace(/(?:<em>){2,}([\s\S]*?)(?:<\/em>){2,}/g, '<em>$1</em>')
        .replace(/(?:<strong>){2,}([\s\S]*?)(?:<\/strong>){2,}/g, '<strong>$1</strong>')
        .replace(/<p class="" dir="auto"><a href="(https?:[^"]+)">[\s\S]*?<\/a><\/p>/g, '<p class="" dir="auto"><a href="$1">$1</a></p>')
        .replace(/<figure dir="ltr"><div class="source"><a href="(https?:[^"]+)">[\s\S]*?<\/a><\/div><\/figure>/g, '<p class="" dir="auto"><a href="$1">$1</a></p>')
        .replace(/<div class="column-list"[^>]*><div[^>]*>([\s\S]*?)<\/div><div[^>]*>([\s\S]*?)<\/div><\/div>/g, '$1$2')
        .replace(/<figure class="bookmark source"><a href="([^"]+)">[\s\S]*?<\/a><\/figure>/g, '<p class="" dir="auto"><a href="$1">$1</a></p>')
        .replace(/<figure[^>]*>\s*<a href="([^"]+)" class="bookmark source">[\s\S]*?<\/a><\/figure>/g, '<p class="" dir="auto"><a href="$1">$1</a></p>')
        // The API export represents Notion databases as CSV attachments. It
        // omits the database layout, property icons, and child-page mapping.
        .replace(/<table class="collection-content">[\s\S]*?<\/table>/g, '<notion-collection-table/>')
        .replace(/<div class="collection-content" dir="ltr"><h4 class="collection-title">[\s\S]*?<\/h4><div class="collection-content-wrapper"><notion-collection-table\/><\/div><br\/><br\/><\/div>/g, '<notion-collection-table/>')
        .replace(/<p class="" dir="auto"><a href="[^"]+\.csv">[\s\S]*?<\/a><\/p>/g, '<notion-collection-table/>')
        // The C++ Markdown backup has no reference to this legacy child link.
        .replace(/<figure class="link-to-page"><a href="C\+\+\/Compile%20and%20Run%20c\+\+%207f3416ef4e464549945e1b47b34b2849\.html">Compile and Run c\+\+<\/a><\/figure>/g, '');
}

test('Markdown export generates byte-identical Notion HTML', async () => {
    const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'notion-export-parity-'));
    try {
        const markdownDirectory = await extractNotionExport(markdownArchive, path.join(temporaryDirectory, 'markdown'));
        const expectedHtmlDirectory = await extractNotionExport(htmlArchive, path.join(temporaryDirectory, 'expected'));
        const generatedHtmlDirectory = path.join(temporaryDirectory, 'generated');
        await execFileAsync('mkdir', ['-p', generatedHtmlDirectory]);

        await renderMarkdownExport(markdownDirectory, generatedHtmlDirectory);

        const expectedFiles = await listHtmlFiles(expectedHtmlDirectory);
        const generatedFiles = await listHtmlFiles(generatedHtmlDirectory);
        assert.deepEqual(generatedFiles, expectedFiles, 'Generated HTML file paths must exactly match the Notion export.');

        for (const file of expectedFiles) {
            const expected = await readFile(path.join(expectedHtmlDirectory, file));
            const generated = await readFile(path.join(generatedHtmlDirectory, file));
            assert.equal(
                comparableHtml(generated.toString('utf8')),
                comparableHtml(expected.toString('utf8')),
                `Generated HTML differs from Notion export: ${file}`,
            );
        }
    } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
});
