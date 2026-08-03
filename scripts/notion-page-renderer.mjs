import { marked } from 'marked';

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const ICON_CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const ICON_DOC = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const ICON_FOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const ICON_TOGGLE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
const ICON_HOME = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;

function isDescendantActive(node, currentPageId) {
    if (node.pageId === currentPageId) return true;
    return node.children.some(child => isDescendantActive(child, currentPageId));
}

function renderNavNode(node, resolveNavLink, currentPageId, depth) {
    const href = resolveNavLink(node.filePath);
    const isActive = node.pageId === currentPageId;
    const hasChildren = node.children.length > 0;
    const safeTitle = escapeHtml(node.title);

    if (depth === 0) {
        return `<a href="${href}" class="sidebar-home${isActive ? ' active' : ''}" title="${safeTitle}">
            ${ICON_HOME}<span class="sidebar-label">${safeTitle}</span>
        </a>
        <div class="sidebar-divider"></div>
        ${node.children.map(child => renderNavNode(child, resolveNavLink, currentPageId, 1)).join('')}`;
    }

    if (hasChildren) {
        const groupOpen = isDescendantActive(node, currentPageId);
        return `<div class="sidebar-group${groupOpen ? ' open' : ''}">
            <button class="sidebar-group-header${isActive ? ' active' : ''}" title="${safeTitle}">
                <span class="sidebar-item-icon">${ICON_FOLDER}</span>
                <span class="sidebar-label">${safeTitle}</span>
                <span class="sidebar-chevron">${ICON_CHEVRON}</span>
            </button>
            <div class="sidebar-group-items">
                ${node.children.map(child => renderNavNode(child, resolveNavLink, currentPageId, depth + 1)).join('')}
            </div>
        </div>`;
    }

    const indent = depth > 1 ? 'sidebar-link--nested' : '';
    return `<a href="${href}" class="sidebar-link ${indent}${isActive ? ' active' : ''}" title="${safeTitle}">
        <span class="sidebar-item-icon">${ICON_DOC}</span>
        <span class="sidebar-label">${safeTitle}</span>
    </a>`;
}

export function renderNotionPage(markdown, {
    resolvePageLink,
    resolveNavLink,
    title = 'Computer Science',
    currentPageId,
    navTree,
} = {}) {
    const normalisedMarkdown = markdown
        .replace(new RegExp(`^# ${escapeRegex(title)}\\s*\\n+`, 'i'), '')
        .replace(/\]\(([^)\s]+)\.md\)/g, ']($1.html)')
        .replace(/<page\s+url="([^"]+)">([\s\S]*?)<\/page>/g, (_match, url, pageTitle) => {
            const localLink = resolvePageLink?.(url);
            return localLink ? `[${pageTitle}](${localLink})` : pageTitle;
        })
        .replace(/<empty-block\s*\/>/g, '');

    const safeTitle = escapeHtml(title);
    const hasSidebar = !!(navTree && resolveNavLink);
    const sidebarHtml = hasSidebar
        ? renderNavNode(navTree, resolveNavLink, currentPageId, 0)
        : '';

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; }
    body { display: flex; font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #111; background: #fff; }

    /* ── Sidebar ── */
    .sidebar {
      width: 260px;
      min-width: 260px;
      height: 100vh;
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e5e7eb;
      background: #f9fafb;
      overflow: hidden;
      transition: width 0.2s ease, min-width 0.2s ease;
      flex-shrink: 0;
    }
    .sidebar.collapsed { width: 56px; min-width: 56px; }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 12px 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      flex-shrink: 0;
    }
    .sidebar-header-title {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      white-space: nowrap;
    }
    .sidebar-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #6b7280;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .sidebar-toggle:hover { background: #e5e7eb; color: #111; }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 0;
    }
    .sidebar-nav::-webkit-scrollbar { width: 4px; }
    .sidebar-nav::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

    .sidebar-home {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
      text-decoration: none;
      white-space: nowrap;
      border-radius: 0;
      transition: background 0.1s;
    }
    .sidebar-home:hover { background: #f3f4f6; color: #111; }
    .sidebar-home.active { color: #2563eb; }

    .sidebar-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 6px 12px;
    }

    .sidebar-group-header {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 7px 16px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      text-align: left;
      white-space: nowrap;
      transition: background 0.1s;
    }
    .sidebar-group-header:hover { background: #f3f4f6; }
    .sidebar-group-header.active { color: #2563eb; }

    .sidebar-chevron {
      margin-left: auto;
      color: #9ca3af;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .sidebar-group.open > .sidebar-group-header .sidebar-chevron { transform: rotate(90deg); }

    .sidebar-group-items {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.25s ease;
    }
    .sidebar-group.open > .sidebar-group-items { max-height: 9999px; }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 16px 6px 36px;
      font-size: 0.875rem;
      color: #4b5563;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.1s;
    }
    .sidebar-link.sidebar-link--nested { padding-left: 52px; }
    .sidebar-link:hover { background: #f3f4f6; color: #111; }
    .sidebar-link.active { color: #2563eb; background: #eff6ff; font-weight: 500; }

    .sidebar-item-icon { flex-shrink: 0; color: #9ca3af; }
    .sidebar-label { overflow: hidden; text-overflow: ellipsis; min-width: 0; }

    /* Collapsed sidebar — hide labels */
    .sidebar.collapsed .sidebar-label,
    .sidebar.collapsed .sidebar-header-title,
    .sidebar.collapsed .sidebar-chevron,
    .sidebar.collapsed .sidebar-divider { display: none; }
    .sidebar.collapsed .sidebar-home,
    .sidebar.collapsed .sidebar-group-header,
    .sidebar.collapsed .sidebar-link { padding: 10px; justify-content: center; gap: 0; }

    /* ── Content ── */
    .page-content {
      flex: 1;
      min-width: 0;
      padding: 2.5rem 3rem;
    }
    .page-content > * { max-width: 720px; }
    .page-title { margin: 0 0 1.5rem; font-size: 2.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
    h1, h2, h3 { margin: 1.5em 0 0; font-weight: 600; line-height: 1.2; letter-spacing: -.01em; }
    h1 { font-size: 1.875rem; } h2 { font-size: 1.5rem; } h3 { font-size: 1.25rem; }
    p, ul, ol, blockquote, pre, table { margin: 1.25em 0; }
    ul, ol { padding-left: 1.7em; } li + li { margin-top: .25em; }
    a { color: #2563eb; text-decoration: underline; text-underline-offset: .15em; }
    hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2em 0; }
    pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: #f3f4f6; }
    pre { padding: 1.25em 1.5em; overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 6px; white-space: pre; background: #f8fafc; }
    code { padding: .15em .35em; border-radius: 4px; font-size: .9em; } pre code { padding: 0; background: transparent; }
    blockquote { padding-left: 1rem; border-left: 3px solid #e5e7eb; color: #6b7280; margin-left: 0; }
    table { border-collapse: collapse; width: 100%; } th, td { padding: .5rem .75rem; border: 1px solid #e5e7eb; text-align: left; vertical-align: top; }
    th { background: #f9fafb; font-weight: 600; }
    img { max-width: 100%; height: auto; } input[type="checkbox"] { accent-color: #2563eb; }
  </style>
</head>
<body>
${hasSidebar ? `  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-header-title">Notes</span>
      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">${ICON_TOGGLE}</button>
    </div>
    <nav class="sidebar-nav">${sidebarHtml}</nav>
  </aside>` : ''}
  <div class="page-content">
    <h1 class="page-title">${safeTitle}</h1>
    ${marked.parse(normalisedMarkdown)}
  </div>
${hasSidebar ? `  <script>
    (function() {
      var sidebar = document.getElementById('sidebar');
      var toggle = document.getElementById('sidebar-toggle');
      var COLLAPSE_KEY = 'notes-sidebar-collapsed';
      if (localStorage.getItem(COLLAPSE_KEY) === '1') sidebar.classList.add('collapsed');
      toggle.addEventListener('click', function() {
        var collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
      });
      document.querySelectorAll('.sidebar-group-header').forEach(function(btn) {
        var group = btn.closest('.sidebar-group');
        var key = 'notes-group-' + group.querySelector('.sidebar-label').textContent.trim();
        if (localStorage.getItem(key) === '1') group.classList.add('open');
        btn.addEventListener('click', function() {
          var open = group.classList.toggle('open');
          localStorage.setItem(key, open ? '1' : '0');
        });
      });
    })();
  </script>` : ''}
</body>
</html>`;
}
