import assert from 'node:assert/strict';
import test from 'node:test';
import { renderNotionPage } from './notion-page-renderer.mjs';

test('renders Notion Markdown as a dark, structured notes page', () => {
    const html = renderNotionPage('# Networking\n\n- TCP\n- UDP\n\n```js\nconst port = 443;\n```');

    assert.match(html, /background: #000/);
    assert.match(html, /class="page-title">Computer Science/);
    assert.match(html, /<h1>Networking<\/h1>/);
    assert.match(html, /<li>TCP<\/li>/);
    assert.match(html, /<pre><code class="language-js">/);
});
