import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const [inputArchive, outputArchive] = process.argv.slice(2);

if (!inputArchive || !outputArchive) {
    throw new Error('Usage: node scripts/normalise-notion-html-export.mjs <input-export.zip> <output-export.zip>');
}

function normaliseHtml(html) {
    return html
        .replace(/\r\n/g, '\n')
        // Bookmark cards contain Notion's fetched, time-dependent preview data. Keep
        // the destination URL, which is all the Markdown export provides.
        .replace(/<figure[^>]*>\s*<a href="([^"]+)" class="bookmark source">[\s\S]*?<\/a><\/figure>/g, '<figure class="bookmark source"><a href="$1">$1</a></figure>')
        .replaceAll('<p class="" dir="auto">\n</p>', '')
        .replace(/<meta name="data-notion-page-icon"[^>]*\/>/g, '')
        .replace(/<link rel="icon"[^>]*\/>/g, '')
        .replace(/<div class="page-header-icon[^"]*">[\s\S]*?<\/div>/g, '')
        .replace(/<span class="icon" data-emoji="[^"]*"><\/span>/g, '')
        .replace(/\s(?:id|data-notion-page-id|data-notion-space-id|data-notion-page-icon)="[^"]*"/gi, '');
}

async function normaliseDirectory(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            await normaliseDirectory(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            const source = await readFile(entryPath, 'utf8');
            const normalised = normaliseHtml(source);
            await writeFile(entryPath, normalised);
        }
    }
}

const stagingDirectory = await mkdtemp(path.join(tmpdir(), 'normalise-notion-html-'));
try {
    const outerDirectory = path.join(stagingDirectory, 'outer');
    const contentDirectory = path.join(stagingDirectory, 'content');
    const outputDirectory = path.join(stagingDirectory, 'output');
    await execFileAsync('mkdir', ['-p', outerDirectory, contentDirectory, outputDirectory]);
    await execFileAsync('bsdtar', ['-xf', inputArchive, '-C', outerDirectory]);

    const nestedArchive = (await readdir(outerDirectory)).find((name) => /^ExportBlock-.*\.zip$/i.test(name));
    if (!nestedArchive) throw new Error('The input archive does not contain a Notion export ZIP.');

    await execFileAsync('bsdtar', ['-xf', path.join(outerDirectory, nestedArchive), '-C', contentDirectory]);
    await normaliseDirectory(contentDirectory);

    const normalisedNestedArchive = path.join(outputDirectory, nestedArchive);
    await execFileAsync('bsdtar', ['-a', '-cf', normalisedNestedArchive, '-C', contentDirectory, '.']);
    await execFileAsync('bsdtar', ['-a', '-cf', outputArchive, '-C', outputDirectory, nestedArchive]);
} finally {
    await rm(stagingDirectory, { recursive: true, force: true });
}
