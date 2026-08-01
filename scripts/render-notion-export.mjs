import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const pageStyles = await readFile(new URL('./notion-export-template.html', import.meta.url), 'utf8');

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function normaliseMarkdown(markdown) {
    return markdown
        .replace(/\]\(([^)]+)\.md\)/g, ']($1.html)')
        .replace(/<page\s+url="[^"]+">([\s\S]*?)<\/page>/g, '$1')
        .replace(/<empty-block\s*\/>/g, '');
}

function renderPage(markdown) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] ?? 'Untitled';
    const content = normaliseMarkdown(markdown.replace(/^#\s+.+\n*/m, ''));
    const renderer = new marked.Renderer();
    const loadedPrismLanguages = new Set();
    renderer.heading = function ({ tokens, depth }) {
        return `<h${depth} class="" dir="auto">${this.parser.parseInline(tokens)}</h${depth}>`;
    };
    renderer.link = function ({ href, tokens }) {
        const target = href.endsWith('.md') ? `${href.slice(0, -2)}html` : href;
        return `<a href="${escapeHtml(target)}">${this.parser.parseInline(tokens)}</a>`;
    };
    renderer.image = ({ href }) => `<figure class="image" data-notion-image="${escapeHtml(href)}" dir="ltr"><a href="${escapeHtml(href)}"><img src="${escapeHtml(href)}"/></a></figure>`;
    renderer.blockquote = function ({ tokens }) {
        const content = this.parser.parse(tokens).replace(/^<p class="" dir="auto">([\s\S]*?)<\/p>/, '$1');
        return `<blockquote class="" dir="auto">${content}</blockquote>`;
    };
    renderer.paragraph = function ({ tokens }) {
        const text = this.parser.parseInline(tokens);
        if (text.startsWith('<figure class="image"')) return text;
        const localPage = text.match(/^<a href="([^"]+\.html)">([^<]*)<\/a>$/);
        if (localPage) return `<figure class="link-to-page"><a href="${localPage[1]}">${localPage[2]}</a></figure>`;
        return `<p class="" dir="auto">${text.replaceAll('\n', '<br/>')}</p>`;
    };
    renderer.list = function ({ ordered, start, items }) {
        return items.map((item, index) => {
            const content = this.parser.parse(item.tokens);
            if (ordered) {
                return `<ol type="1" class="numbered-list" start="${Number(start) + index}" dir="auto"><li>${content}</li></ol>`;
            }
            return `<ul class="bulleted-list" dir="auto"><li style="list-style-type:disc">${content}</li></ul>`;
        }).join('');
    };
    renderer.code = ({ text, lang }) => {
        const code = escapeHtml(text).replaceAll('&#39;', '&#x27;');
        if (lang) {
            const prismIntegrity = {
                java: 'sha512-xKcnbsdT0KMoA4yrozkqZM1XJVTrPsjdQwvigxlAlxEDu8YDvC/jl+LfVqn0fY3Vs6m2y4a89JCHEIA/Z9zpmQ==',
                bash: 'sha512-whYhDwtTmlC/NpZlCr6PSsAaLOrfjVg/iXAnC4H/dtiHawpShhT2SlIMbpIhT/IL/NrpdMm+Hq2C13+VKpHTYw==',
            };
            const prismComponents = lang === 'tsx'
                ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js" integrity="sha512-m3JYEI6gx5fh9jF10FjGoMzVKcV2N6nchcDcqPCdI1L3R2WQV7br2XVNR8iTLb2daOMRl3zldbcfT40xU2ntVw==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js" integrity="sha512-uOw7XYETzS/DPmmirpP5UCMihSDNMeyTS965J0/456OSPfxn9xEtHHjj5Q/5WefVdqyMfN/afmQnNpZd/tpkcA==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-tsx.min.js" integrity="sha512-xjGCJ9YxyZBfYTCHsEjkOZMoOse1W3cKMXv1szXrxs68myuXt0YTj3/xKPar6iDMlXzTUSEqwUxprWcyp+plaw==" crossorigin="anonymous" referrerPolicy="no-referrer"></script>`
                : `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js" integrity="${prismIntegrity[lang] ?? ''}" crossorigin="anonymous" referrerPolicy="no-referrer"></script>`;
            const prismAssets = loadedPrismLanguages.has(lang)
                ? ''
                : `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" integrity="sha512-7Z9J3l1+EYfeaPKcGXu3MS/7T+w19WtKQY/n+xzmw4hZhJ9tyYmcUS+4QqAlzhicE5LAfMQSF3iFTK9bQdTxXg==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" integrity="sha512-tN7Ec6zAFaVSG3TpNAKtk4DOHNpSwKHxxrsiw4GHKESGPs5njn/0sMCUMl2svV4wo4BK/rCP7juYz+zx+l6oeQ==" crossorigin="anonymous" referrerPolicy="no-referrer"/>${prismComponents}`;
            loadedPrismLanguages.add(lang);
            loadedPrismLanguages.add('__base__');
            return `${prismAssets}<pre class="code code-wrap" data-notion-code-syntax="${lang}"><code class="language-${lang}" style="white-space:pre-wrap;word-break:break-all">${code}</code></pre>`;
        }
        const prismAssets = loadedPrismLanguages.has('__base__')
            ? ''
            : `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" integrity="sha512-7Z9J3l1+EYfeaPKcGXu3MS/7T+w19WtKQY/n+xzmw4hZhJ9tyYmcUS+4QqAlzhicE5LAfMQSF3iFTK9bQdTxXg==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" integrity="sha512-tN7Ec6zAFaVSG3TpNAKtk4DOHNpSwKHxxrsiw4GHKESGPs5njn/0sMCUMl2svV4wo4BK/rCP7juYz+zx+l6oeQ==" crossorigin="anonymous" referrerPolicy="no-referrer"/>`;
        loadedPrismLanguages.add('__base__');
        return `${prismAssets}<pre class="code code-wrap"><code style="white-space:pre-wrap;word-break:break-all">${code}</code></pre>`;
    };
    const body = marked.parse(content, { renderer })
        .replaceAll('&#39;', '&#x27;')
        .replace(/<strong><code>([\s\S]*?)<\/code><\/strong>/g, '<code><strong>$1</strong></code>');
    return `<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>${escapeHtml(title)}</title>${pageStyles}</head><body><article class="page sans"><header><h1 class="page-title" dir="auto">${escapeHtml(title)}</h1><p class="page-description" dir="auto"></p></header><div class="page-body">${body}</div></article><span class="sans" style="font-size:14px;padding-top:2em"></span></body></html>`;
}

async function renderDirectory(sourceDirectory, outputDirectory) {
    for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDirectory, entry.name);
        if (entry.isDirectory()) {
            await renderDirectory(sourcePath, path.join(outputDirectory, entry.name));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const outputPath = path.join(outputDirectory, entry.name.replace(/\.md$/, '.html'));
            await mkdir(path.dirname(outputPath), { recursive: true });
            await writeFile(outputPath, renderPage(await readFile(sourcePath, 'utf8')));
        }
    }
}

export async function renderMarkdownExport(markdownDirectory, outputDirectory) {
    await renderDirectory(markdownDirectory, outputDirectory);
}
