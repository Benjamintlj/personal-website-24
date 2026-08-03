import { marked } from 'marked';

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderNotionPage(markdown, { resolvePageLink, title = 'Computer Science' } = {}) {
    const normalisedMarkdown = markdown
        .replace(new RegExp(`^# ${escapeRegex(title)}\\s*\\n+`, 'i'), '')
        .replace(/\]\(([^)\s]+)\.md\)/g, ']($1.html)')
        .replace(/<page\s+url="([^"]+)">([\s\S]*?)<\/page>/g, (_match, url, pageTitle) => {
            const localLink = resolvePageLink?.(url);
            return localLink ? `[${pageTitle}](${localLink})` : pageTitle;
        })
        .replace(/<empty-block\s*\/>/g, '')
        .replace(/<unknown[^>]*>([\s\S]*?)<\/unknown>/g, '$1');

    const safeTitle = escapeHtml(title);
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 100%; }
    body { max-width: 900px; margin: 2em auto; padding: 0 1.5rem 3rem; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; white-space: pre-wrap; }
    .page-title { margin: 4rem 0 .75em; font-size: 2.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
    h1, h2, h3 { margin: 1.5em 0 0; font-weight: 600; line-height: 1.2; letter-spacing: -.01em; }
    h1 { font-size: 1.875rem; } h2 { font-size: 1.5rem; } h3 { font-size: 1.25rem; }
    p, ul, ol, blockquote, pre, table { margin: 1.25em 0; }
    ul, ol { padding-left: 1.7em; } li + li { margin-top: .25em; }
    a { text-decoration: underline; text-underline-offset: .15em; }
    hr { border: 0; border-top: 1px solid #ccc; margin: 2em 0; }
    pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    pre { padding: 1.5em; overflow-x: auto; border: 1px solid #ccc; border-radius: 3px; white-space: pre; }
    code { padding: .15em .3em; border-radius: .2rem; } pre code { padding: 0; }
    blockquote { padding-left: 1rem; border-left: 3px solid #ccc; }
    table { border-collapse: collapse; width: 100%; } th, td { padding: .5rem; border: 1px solid #ccc; text-align: left; vertical-align: top; }
    img { max-width: 100%; height: auto; } input[type="checkbox"] { accent-color: currentColor; }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>document.addEventListener('DOMContentLoaded', () => hljs.highlightAll());</script>
</head>
<body>
  <main class="page-body"><h1 class="page-title">${safeTitle}</h1>${marked.parse(normalisedMarkdown)}</main>
</body>
</html>`;
}
