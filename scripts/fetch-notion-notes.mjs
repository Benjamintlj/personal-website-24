import { mkdir, writeFile } from 'node:fs/promises';
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

const html = renderNotionPage(page.markdown);

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(projectRoot, 'public', 'notes', 'Private & Shared', 'Computer Science b0d29bee5364465e957af27b14e3527b.html');
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Fetched and rendered Notion page to ${destination}`);
