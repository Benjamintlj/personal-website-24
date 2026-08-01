import assert from 'node:assert/strict';
import test from 'node:test';
import { renderNotionPage } from './notion-page-renderer.mjs';

test('renders Notion Markdown as a dark, structured notes page', () => {
    const html = renderNotionPage('# Networking\n\n- TCP\n- UDP\n\n<page url="https://app.notion.com/p/networking">Networking notes</page>\n\n<empty-block/>\n\n```js\nconst port = 443;\n```');

    assert.match(html, /background: #000/);
    assert.match(html, /class="page-title">Computer Science/);
    assert.match(html, /<h1>Networking<\/h1>/);
    assert.match(html, /<li>TCP<\/li>/);
    assert.match(html, /<a href="https:\/\/app\.notion\.com\/p\/networking">Networking notes<\/a>/);
    assert.doesNotMatch(html, /<page url=/);
    assert.match(html, /<pre><code class="language-js">/);
});

test('renders exported Markdown links as links to local HTML pages', () => {
    const markdown = '# Computer Science\n\n[Example page](Computer%20Science/Example%20Page%20abc123.md)\n\n# Fast Access';
    const html = renderNotionPage(markdown);

    assert.equal((html.match(/class="page-title">Computer Science/g) ?? []).length, 1);
    assert.match(html, /href="Computer%20Science\/Example%20Page%20abc123\.html"/);
    assert.match(html, /<h1>Fast Access<\/h1>/);
});
