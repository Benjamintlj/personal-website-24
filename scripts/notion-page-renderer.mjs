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
        .replace(/<empty-block\s*\/>/g, '');

    const safeTitle = escapeHtml(title);
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 100%; background: #000; }
    body { max-width: 900px; margin: 2em auto; padding: 0 1.5rem 3rem; color: #e5e5e5; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .page-title { margin: 4rem 0 .75em; font-size: 2.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
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
  <main class="page-body"><h1 class="page-title">${safeTitle}</h1>${marked.parse(normalisedMarkdown)}</main>
</body>
</html>`;
}
