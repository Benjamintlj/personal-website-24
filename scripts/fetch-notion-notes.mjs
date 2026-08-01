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
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 100%; background: #000; }
    body { max-width: 900px; margin: 2em auto; padding: 0 1.5rem 3rem; color: #e5e5e5; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .page-title { margin: 0 0 .75em; font-size: 2.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
    h1, h2, h3 { margin: 1.5em 0 0; font-weight: 600; line-height: 1.2; letter-spacing: -.01em; }
    h1 { font-size: 1.875rem; } h2 { font-size: 1.5rem; } h3 { font-size: 1.25rem; }
    p, ul, ol, blockquote, pre, table { margin: 1.25em 0; }
    ul, ol { padding-left: 1.7em; } li + li { margin-top: .25em; }
    a { color: inherit; text-decoration: underline; text-underline-offset: .15em; }
    strong { color: #fff; } hr { border: 0; border-top: 1px solid #404040; margin: 2em 0; }
    pre, code { background: #171717; color: #e5e5e5; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    pre { padding: 1.5em; overflow-x: auto; border: 1px solid #404040; border-radius: 3px; white-space: pre; }
    code { padding: .15em .3em; border-radius: .2rem; } pre code { padding: 0; background: transparent; }
    blockquote { padding-left: 1rem; border-left: 3px solid #404040; color: #d4d4d4; }
    table { border-collapse: collapse; width: 100%; } th, td { padding: .5rem; border: 1px solid #404040; text-align: left; vertical-align: top; }
    th { color: #fff; background: #171717; } img { max-width: 100%; height: auto; } input[type="checkbox"] { accent-color: #93c5fd; }
  </style>
</head>
<body>
  <main class="page-body"><h1 class="page-title">Computer Science</h1>${marked.parse(page.markdown)}</main>
</body>
</html>`;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(projectRoot, 'public', 'notes', 'Private & Shared', 'Computer Science b0d29bee5364465e957af27b14e3527b.html');
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Fetched and rendered Notion page to ${destination}`);
