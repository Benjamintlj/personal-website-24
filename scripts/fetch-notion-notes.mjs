import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNotionPage } from './notion-page-renderer.mjs';

const rootPageId = 'b0d29bee5364465e957af27b14e3527b';
const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
    throw new Error('NOTION_API_KEY must be set before fetching Notion pages.');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notesDir = path.join(projectRoot, 'public', 'notes', 'Private & Shared');

async function fetchPageMarkdown(pageId) {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}/markdown`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Notion-Version': '2026-03-11',
        },
    });
    if (!response.ok) {
        throw new Error(`Notion API returned ${response.status} for page ${pageId}`);
    }
    const data = await response.json();
    if (data.truncated) {
        process.stderr.write(`[WARN] Page ${pageId} is truncated — share all nested content with the connection.\n`);
    }
    return data.markdown;
}

function extractChildPageIds(markdown) {
    const ids = new Set();
    for (const match of markdown.matchAll(/<page\s+url="([^"]+)"/g)) {
        const id = match[1].match(/([a-f0-9]{32})/i)?.[1]?.toLowerCase();
        if (id) ids.add(id);
    }
    return [...ids];
}

function sanitiseTitle(title) {
    return title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/\s+/g, ' ').trim();
}

// BFS crawl starting from the root CS page, following all <page> references
const pageMarkdowns = new Map(); // pageId -> markdown string
const queue = [rootPageId];
const visited = new Set();

while (queue.length > 0) {
    const pageId = queue.shift();
    if (visited.has(pageId)) continue;
    visited.add(pageId);

    let markdown;
    try {
        markdown = await fetchPageMarkdown(pageId);
    } catch (err) {
        process.stderr.write(`[ERROR] Skipping page ${pageId}: ${err.message}\n`);
        continue;
    }

    pageMarkdowns.set(pageId, markdown);
    for (const childId of extractChildPageIds(markdown)) {
        if (!visited.has(childId)) queue.push(childId);
    }
}

// Assign a stable file path to every fetched page
const pageFiles = new Map(); // pageId -> absolute file path
for (const [pageId, markdown] of pageMarkdowns) {
    const rawTitle = markdown.match(/^# (.+)/)?.[1]?.trim() ?? pageId;
    const fileName = `${sanitiseTitle(rawTitle)} ${pageId}.html`;
    pageFiles.set(pageId, path.join(notesDir, fileName));
}

// Render all pages with cross-page links resolved
for (const [pageId, markdown] of pageMarkdowns) {
    const destPath = pageFiles.get(pageId);
    const title = markdown.match(/^# (.+)/)?.[1]?.trim() ?? pageId;

    const html = renderNotionPage(markdown, {
        title,
        resolvePageLink(pageUrl) {
            const id = pageUrl.match(/([a-f0-9]{32})/i)?.[1]?.toLowerCase();
            const target = id ? pageFiles.get(id) : null;
            return target
                ? path.relative(path.dirname(destPath), target)
                    .split(path.sep)
                    .map(encodeURIComponent)
                    .join('/')
                : null;
        },
    });

    await mkdir(path.dirname(destPath), { recursive: true });
    await writeFile(destPath, html);
    console.log(`Fetched and rendered Notion page to ${destPath}`);
}

console.log(`Done — ${pageMarkdowns.size} page(s) fetched and rendered.`);
