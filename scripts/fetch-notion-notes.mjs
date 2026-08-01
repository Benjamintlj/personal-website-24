import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNotionPage } from './notion-page-renderer.mjs';

const pageId = 'b0d29bee5364465e957af27b14e3527b';
const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
    throw new Error('NOTION_API_KEY must be set before fetching the Notion page.');
}

const response = await fetch(`https://api.notion.com/v1/pages/${pageId}/markdown`, {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': '2026-03-11',
    },
});

if (!response.ok) {
    throw new Error(`Notion API request failed (${response.status}). Confirm that the Computer Science page is shared with the connection.`);
}

const page = await response.json();
if (page.truncated) {
    throw new Error('The Notion response is incomplete. Share all nested content with the connection or split the page.');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(projectRoot, 'public', 'notes', 'Private & Shared', 'Computer Science b0d29bee5364465e957af27b14e3527b.html');
const notesRoot = path.join(projectRoot, 'public', 'notes');

async function collectLocalPageLinks(directory, links) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            await collectLocalPageLinks(entryPath, links);
            continue;
        }

        const pageId = entry.name.match(/([a-f0-9]{32})\.html$/i)?.[1]?.toLowerCase();
        if (pageId) {
            links.set(pageId, entryPath);
        }
    }
}

const localPageFiles = new Map();
await collectLocalPageLinks(notesRoot, localPageFiles);
const html = renderNotionPage(page.markdown, {
    resolvePageLink(pageUrl) {
        const pageId = pageUrl.match(/([a-f0-9]{32})/i)?.[1]?.toLowerCase();
        const target = pageId ? localPageFiles.get(pageId) : null;
        return target ? path.relative(path.dirname(destination), target).split(path.sep).map(encodeURIComponent).join('/') : null;
    },
});

await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Fetched and rendered Notion page to ${destination}`);
