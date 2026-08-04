import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './render-notion-export.mjs';

const rootPageId = 'b0d29bee5364465e957af27b14e3527b';
const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
    throw new Error('NOTION_API_KEY must be set before fetching Notion pages.');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(projectRoot, 'public');
const notesDir = path.join(publicDir, 'notes', 'Private & Shared');

const notionHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Notion-Version': '2026-03-11',
};

async function fetchWithRetry(url, options, maxRetries = 5) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429) {
                const retryAfter = Number(response.headers.get('retry-after') ?? 10);
                const delay = Math.max(retryAfter * 1000, 2 ** attempt * 1000);
                process.stderr.write(`[WARN] Rate limited — retrying in ${Math.round(delay / 1000)}s (attempt ${attempt + 1}/${maxRetries})\n`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            return response;
        } catch (err) {
            if (attempt === maxRetries) throw err;
            const delay = 2 ** attempt * 1000;
            process.stderr.write(`[WARN] Request failed (${err.message}) — retrying in ${Math.round(delay / 1000)}s\n`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

async function fetchPageMarkdown(pageId) {
    const response = await fetchWithRetry(`https://api.notion.com/v1/pages/${pageId}/markdown`, {
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
    const response = await fetchWithRetry(`https://api.notion.com/v1/pages/${pageId}`, {
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

function filePathToUrlPath(filePath) {
    const rel = path.relative(publicDir, filePath);
    return '/' + rel.split(path.sep).map(encodeURIComponent).join('/');
}

// BFS crawl — track parent→children relationships for nav tree
const pageMarkdowns = new Map(); // pageId -> markdown string
const pageChildren = new Map();  // pageId -> [childId, ...]
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

    const childIds = extractChildPageIds(markdown);
    if (childIds.length > 0) pageChildren.set(pageId, childIds);
    for (const childId of childIds) {
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

// Build navigation tree rooted at the CS page (URL paths for the client)
function buildNavNode(pageId) {
    const filePath = pageFiles.get(pageId);
    return {
        pageId,
        title: pageTitles.get(pageId) ?? pageId,
        urlPath: filePath ? filePathToUrlPath(filePath) : null,
        children: (pageChildren.get(pageId) ?? [])
            .filter(id => pageFiles.has(id))
            .map(buildNavNode),
    };
}
const navTree = buildNavNode(rootPageId);

// Save raw Notion markdown for the "copy markdown" button
const markdownDir = path.join(publicDir, 'notes-md');
await mkdir(markdownDir, { recursive: true });
for (const [pageId, markdown] of pageMarkdowns) {
    await writeFile(path.join(markdownDir, `${pageId}.md`), markdown);
}
console.log(`Wrote ${pageMarkdowns.size} markdown files to public/notes-md/`);

// Write nav tree JSON for the Next.js notes viewer
await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'notes-nav.json'), JSON.stringify(navTree, null, 2));
console.log('Wrote public/notes-nav.json');

// Build search index — strip markdown syntax to plain text
function markdownToText(md) {
    return md
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[>*\-+]\s+/gm, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

const searchIndex = [];
for (const [pageId, markdown] of pageMarkdowns) {
    searchIndex.push({
        pageId,
        title: pageTitles.get(pageId) ?? pageId,
        urlPath: filePathToUrlPath(pageFiles.get(pageId)),
        text: markdownToText(markdown),
    });
}
await writeFile(path.join(publicDir, 'notes-search.json'), JSON.stringify(searchIndex));
console.log(`Wrote public/notes-search.json (${searchIndex.length} entries)`);

// Render all pages with cross-page links resolved (no sidebar — stays in Next.js)
for (const [pageId, markdown] of pageMarkdowns) {
    const destPath = pageFiles.get(pageId);
    const title = pageTitles.get(pageId);

    const preprocessed = markdown
        .replace(/<page\s+url="([^"]+)">([\s\S]*?)<\/page>/g, (_, url, pageTitle) => {
            const id = url.match(/([a-f0-9]{32})/i)?.[1]?.toLowerCase();
            const target = id ? pageFiles.get(id) : null;
            if (!target) return pageTitle;
            const relPath = path.relative(path.dirname(destPath), target)
                .split(path.sep).map(encodeURIComponent).join('/');
            return `[${pageTitle}](${relPath})`;
        })
        .replace(/<empty-block\s*\/>/g, '')
        .replace(/<unknown[^>]*>([\s\S]*?)<\/unknown>/g, '$1');

    const html = renderPage(preprocessed, null, pageTitles.get(pageId));

    await mkdir(path.dirname(destPath), { recursive: true });
    await writeFile(destPath, html);
    console.log(`Fetched and rendered Notion page to ${destPath}`);
}

console.log(`Done — ${pageMarkdowns.size} page(s) fetched and rendered.`);
