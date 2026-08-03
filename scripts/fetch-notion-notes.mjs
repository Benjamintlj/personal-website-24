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

const notionHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Notion-Version': '2026-03-11',
};

async function fetchPageMarkdown(pageId) {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}/markdown`, {
        headers: notionHeaders,
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

async function fetchPageTitle(pageId) {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        headers: notionHeaders,
    });
    if (!response.ok) return null;
    const data = await response.json();
    const titleProp = Object.values(data.properties ?? {}).find(p => p.type === 'title');
    return titleProp?.title?.[0]?.plain_text ?? null;
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

// Build title map: prefer H1 from markdown, fall back to Notion page properties
const pageTitles = new Map(); // pageId -> title string
for (const [pageId, markdown] of pageMarkdowns) {
    const h1 = markdown.match(/^# (.+)/)?.[1]?.trim();
    if (h1) {
        pageTitles.set(pageId, h1);
    } else {
        const apiTitle = await fetchPageTitle(pageId);
        pageTitles.set(pageId, apiTitle ?? pageId);
    }
}

// Assign a stable file path to every fetched page
const pageFiles = new Map(); // pageId -> absolute file path
for (const [pageId] of pageMarkdowns) {
    const fileName = `${sanitiseTitle(pageTitles.get(pageId))} ${pageId}.html`;
    pageFiles.set(pageId, path.join(notesDir, fileName));
}

// Render all pages with cross-page links resolved
for (const [pageId, markdown] of pageMarkdowns) {
    const destPath = pageFiles.get(pageId);
    const title = pageTitles.get(pageId);

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
