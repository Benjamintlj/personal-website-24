import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

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

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Computer Science</title>
  <style>
    :root { color-scheme: dark; }
    body { max-width: 56rem; margin: 0 auto; padding: 2rem; background: #000; color: #e5e5e5; font: 16px/1.6 system-ui, sans-serif; }
    a { color: #93c5fd; } pre, code { background: #171717; color: #e5e5e5; } pre { padding: 1rem; overflow-x: auto; border: 1px solid #404040; border-radius: .5rem; } code { padding: .15em .3em; border-radius: .2rem; } pre code { padding: 0; } blockquote { border-left: 3px solid #404040; margin-left: 0; padding-left: 1rem; } table { border-collapse: collapse; } td, th { border: 1px solid #404040; padding: .5rem; text-align: left; } img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <main>${marked.parse(page.markdown)}</main>
</body>
</html>`;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(projectRoot, 'public', 'notes', 'Private & Shared', 'Computer Science b0d29bee5364465e957af27b14e3527b.html');
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Fetched and rendered Notion page to ${destination}`);
