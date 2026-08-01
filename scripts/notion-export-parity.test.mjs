import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

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

async function renderMarkdownExport(_markdownDirectory, _outputDirectory) {
    // This is deliberately empty: the parity test is being written before the renderer.
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
            assert.ok(generated.equals(expected), `Generated HTML differs from Notion export: ${file}`);
        }
    } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
});
