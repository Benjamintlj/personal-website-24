import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const source = new URL('../content/building-a-storage-network/Book/', import.meta.url);
const destination = new URL('../public/building-a-storage-network/', import.meta.url);
const entries = ['index.html', 'assets', 'companion'];

// Publish the book's ready-made website, without its manuscript or authoring tools.
try {
    await Promise.all(entries.map((entry) => access(new URL(entry, source))));
} catch {
    throw new Error('Book content is missing. Run git submodule update --init --recursive, then retry.');
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of entries) {
    await cp(new URL(entry, source), new URL(entry, destination), { recursive: true });
}

// Keep the standalone book's tab icon consistent with the portfolio.
const index = new URL('index.html', destination);
const html = await readFile(index, 'utf8');
await writeFile(index, html.replace(/<link\b(?=[^>]*\brel=["'](?:shortcut )?icon["'])[^>]*>/gi, '')
    .replace('</head>', '<link rel="icon" type="image/svg+xml" href="favicon.svg"></head>'));
await cp(new URL('../src/app/icon.svg', import.meta.url), new URL('favicon.svg', destination));

console.log('Prepared Building a Storage Network in public/building-a-storage-network/');
