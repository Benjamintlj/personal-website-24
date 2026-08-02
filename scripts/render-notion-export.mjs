import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import katex from 'katex';

const pageStyles = await readFile(new URL('./notion-export-template.html', import.meta.url), 'utf8');

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function normaliseIndentedParagraphs(markdown) {
    let inFence = false;
    let inAnnotationBlock = false;
    return markdown.split('\n').map((line) => {
        if (/^\s*```/.test(line)) inFence = !inFence;
        if (inFence) return line;
        if (/^ {4,}\^/.test(line)) inAnnotationBlock = true;
        if (inAnnotationBlock && /^ {4}(.+)$/.test(line)) return `<p class="" dir="auto">${line}</p>`;
        if (inAnnotationBlock && line && !/^ {4}/.test(line)) inAnnotationBlock = false;
        const paragraph = line.match(/^ {4}([a-z][^\n]+)$/);
        return paragraph ? `<p class="" dir="auto">${paragraph[1]}</p>` : line;
    }).join('\n');
}

function renderInlineEquations(markdown) {
    return markdown.split(/(```[\s\S]*?```)/).map((part, index) => index % 2
        ? part
        : part.replace(/(?<!\\)\$([^$\n]+)\$/g, (_, equation) => {
            const source = equation.trim();
            return `<span data-notion-inline-equation="${escapeHtml(source)}" class="notion-text-equation-token" contenteditable="false">${katex.renderToString(source, { throwOnError: false, output: 'html' })}</span>`;
        })).join('');
}

function normaliseMarkdown(markdown) {
    return normaliseIndentedParagraphs(renderInlineEquations(markdown
        .replace(/\]\(([^)]+)\.md\)/g, ']($1.html)')
        .replace(/`\|`/g, '`\\|`')
        .replace(/^( {4,}[^\n]*[←→][^\n]*)$/gm, '<p class="" dir="auto">$1</p>')
        .replace(/<page\s+url="[^"]+">([\s\S]*?)<\/page>/g, '$1')
        .replace(/<empty-block\s*\/>/g, '')
        // Angle-bracket placeholders are literal note text, not HTML tags.
        .replace(/<([A-Za-z][\w-]*)>/g, '&lt;$1&gt;')));
}

function renderPage(markdown) {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] ?? 'Untitled';
    const content = normaliseMarkdown(markdown.replace(/^#\s+.+\n*/m, ''));
    const renderer = new marked.Renderer();
    const loadedPrismLanguages = new Set();
    const listTypes = [];
    renderer.heading = function ({ tokens, depth }) {
        return `<h${depth} class="" dir="auto">${this.parser.parseInline(tokens)}</h${depth}>`;
    };
    renderer.hr = () => '<hr dir="auto"/>';
    renderer.codespan = ({ text }) => {
        const literal = text.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        const emphasis = literal.match(/^\*([\s\S]*)\*$/);
        return emphasis ? `<code><em>${escapeHtml(emphasis[1])}</em></code>` : `<code>${escapeHtml(literal)}</code>`;
    };
    renderer.link = function ({ href, tokens }) {
        const target = href.endsWith('.md') ? `${href.slice(0, -2)}html` : href;
        return `<a href="${escapeHtml(target)}">${this.parser.parseInline(tokens)}</a>`;
    };
    renderer.image = ({ href, text }) => {
        const isFilename = /^[^/]+\.(?:png|jpe?g|gif|webp|svg)$/i.test(text ?? '');
        const caption = text && text !== 'Untitled' && !isFilename ? `<figcaption>${marked.parseInline(text)}</figcaption>` : '';
        return `<figure class="image" data-notion-image="${escapeHtml(href)}" dir="ltr"><a href="${escapeHtml(href)}"><img src="${escapeHtml(href)}"/></a>${caption}</figure>`;
    };
    renderer.blockquote = function ({ tokens }) {
        const content = this.parser.parse(tokens).replace(/^<p class="" dir="auto">([\s\S]*?)<\/p>/, '$1');
        return `<blockquote class="" dir="auto">${content}</blockquote>`;
    };
    renderer.paragraph = function ({ tokens }) {
        const text = this.parser.parseInline(tokens);
        if (text.startsWith('<figure class="image"')) return text;
        const localPage = text.match(/^<a href="([^"]+\.html)">([\s\S]*)<\/a>$/);
        if (localPage && !/^https?:/i.test(localPage[1])) {
            return `<figure class="link-to-page"><a href="${localPage[1]}">${localPage[2].replace(/<[^>]+>/g, '')}</a></figure>`;
        }
        return `<p class="" dir="auto">${text.replaceAll('\n', '<br/>')}</p>`;
    };
    renderer.table = function ({ header, rows }) {
        const renderRow = (cells) => `<tr dir="ltr">${cells.map((cell) => `<td class="">${this.parser.parseInline(cell.tokens)}</td>`).join('')}</tr>`;
        const renderedHeader = header.map((cell) => this.parser.parseInline(cell.tokens));
        const hasStyledHeader = renderedHeader.some((cell) => cell.includes('<strong>'));
        if (hasStyledHeader) {
            return `<table class="simple-table" dir="ltr"><tbody><tr dir="ltr">${renderedHeader.map((cell) => `<td class="">${cell}</td>`).join('')}</tr>${rows.map(renderRow).join('')}</tbody></table>`;
        }
        return `<table class="simple-table" dir="ltr"><thead class="simple-table-header"><tr dir="ltr">${renderedHeader.map((cell) => `<th class="simple-table-header-color simple-table-header">${cell}</th>`).join('')}</tr></thead><tbody>${rows.map(renderRow).join('')}</tbody></table>`;
    };
    renderer.list = function ({ ordered, start, items }) {
        const listStart = ordered ? Number(start) : 0;
        const parentListType = listTypes.at(-1);
        listTypes.push(ordered ? 'ordered' : 'unordered');
        const html = items.map((item, index) => {
            const parsedContent = this.parser.parse(item.tokens)
                .replace(/^<p class="" dir="auto">([\s\S]*?)<\/p>/, '$1')
                .replace(/(<p class="" dir="auto">)\s+/g, '$1');
            const content = parsedContent
                .split(/(<pre[\s\S]*?<\/pre>)/)
                .map((part, index) => index % 2 ? part : part.replaceAll('\n', '<br/>'))
                .join('')
                // Notion serialises an image caption as the next block in Markdown.
                // In its HTML export that caption remains attached to the image figure.
                .replace(
                    /<p class="" dir="auto"><figure class="image"([\s\S]*?)<\/figure><\/p><p class="" dir="auto"><em>([\s\S]*?)<\/em><\/p>/g,
                    '<figure class="image"$1<figcaption><em>$2</em></figcaption></figure>',
                )
                .replace(/<p class="" dir="auto">(<figure class="image"[\s\S]*?<\/figure>)(?:<br\/>)?\s*<\/p>/g, '$1');
            if (ordered) {
                if (!content.trim()) return `<p class="" dir="auto">${listStart + index}.</p>`;
                return `<ol type="1" class="numbered-list" start="${listStart + index}" dir="auto"><li>${content}</li></ol>`;
            }
            return `<ul class="bulleted-list" dir="auto"><li style="list-style-type:${parentListType === 'unordered' ? 'circle' : 'disc'}">${content}</li></ul>`;
        }).join('');
        listTypes.pop();
        return html;
    };
    renderer.code = ({ text, lang }) => {
        const codeText = text
            .replace(/^\*\*([\s\S]*?)\*\*$/, '$1')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<p class="" dir="auto">([\s\S]*?)<\/p>/g, '    $1')
            .replace(/&lt;p class=&quot;&quot; dir=&quot;auto&quot;&gt;([\s\S]*?)&lt;\/p&gt;/g, '    $1')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>');
        const code = escapeHtml(codeText).replaceAll('&#39;', '&#x27;');
        if (lang) {
            const prismIntegrity = {
                java: 'sha512-xKcnbsdT0KMoA4yrozkqZM1XJVTrPsjdQwvigxlAlxEDu8YDvC/jl+LfVqn0fY3Vs6m2y4a89JCHEIA/Z9zpmQ==',
                bash: 'sha512-whYhDwtTmlC/NpZlCr6PSsAaLOrfjVg/iXAnC4H/dtiHawpShhT2SlIMbpIhT/IL/NrpdMm+Hq2C13+VKpHTYw==',
                json: 'sha512-QXFMVAusM85vUYDaNgcYeU3rzSlc+bTV4JvkfJhjxSHlQEo+ig53BtnGkvFTiNJh8D+wv6uWAQ2vJaVmxe8d3w==',
                jsx: 'sha512-m3JYEI6gx5fh9jF10FjGoMzVKcV2N6nchcDcqPCdI1L3R2WQV7br2XVNR8iTLb2daOMRl3zldbcfT40xU2ntVw==',
                yaml: 'sha512-6O/PZimM3TD1NN3yrazePA4AbZrPcwt1QCGJrVY7WoHDJROZFc9TlBvIKMe+QfqgcslW4lQeBzNJEJvIMC8WhA==',
                c: 'sha512-8VrjxGFLIkS0mgEmO3p46A5OkqATHhrNVwyv2V7yUeZrk1jmSDuI3SOEpC9XHEHUWEOsfzzcJeBlUkee9lKGrw==',
                cpp: 'sha512-namzGTZvHaug0jeipHRN2pMepMiJj+EbrloktVFlMYGnA0EwZhbdLeENjBYLCgoghVbZGinIz/FFYHmB0o3wLw==',
                sql: 'sha512-sijCOJblSCXYYmXdwvqV0tak8QJW5iy2yLB1wAbbLc3OOIueqymizRFWUS/mwKctnzPKpNdPJV3aK1zlDMJmXQ==',
                python: 'sha512-AKaNmg8COK0zEbjTdMHJAPJ0z6VeNqvRvH4/d5M4sHJbQQUToMBtodq4HaV4fa+WV2UTfoperElm66c9/8cKmQ==',
                go: 'sha512-w200Nz1i9KgDNi+IpPMgpZBVRIvfVK/V5vskyHjkz7XJkVnRJcb1uNmpiHhDv0/Ln+GG2VqScKKz/1izBfg64Q==',
            };
            const prismComponents = lang === 'cpp'
                ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js" integrity="${prismIntegrity.c}" crossorigin="anonymous" referrerPolicy="no-referrer"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-cpp.min.js" integrity="${prismIntegrity.cpp}" crossorigin="anonymous" referrerPolicy="no-referrer"></script>`
                : lang === 'csharp' || lang === 'dart'
                ? ''
                : lang === 'tsx'
                ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js" integrity="sha512-m3JYEI6gx5fh9jF10FjGoMzVKcV2N6nchcDcqPCdI1L3R2WQV7br2XVNR8iTLb2daOMRl3zldbcfT40xU2ntVw==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js" integrity="sha512-uOw7XYETzS/DPmmirpP5UCMihSDNMeyTS965J0/456OSPfxn9xEtHHjj5Q/5WefVdqyMfN/afmQnNpZd/tpkcA==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-tsx.min.js" integrity="sha512-xjGCJ9YxyZBfYTCHsEjkOZMoOse1W3cKMXv1szXrxs68myuXt0YTj3/xKPar6iDMlXzTUSEqwUxprWcyp+plaw==" crossorigin="anonymous" referrerPolicy="no-referrer"></script>`
                : `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js" integrity="${prismIntegrity[lang] ?? ''}" crossorigin="anonymous" referrerPolicy="no-referrer"></script>`;
            const prismBaseAssets = loadedPrismLanguages.has('__base__')
                ? ''
                : `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" integrity="sha512-7Z9J3l1+EYfeaPKcGXu3MS/7T+w19WtKQY/n+xzmw4hZhJ9tyYmcUS+4QqAlzhicE5LAfMQSF3iFTK9bQdTxXg==" crossorigin="anonymous" referrerPolicy="no-referrer"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" integrity="sha512-tN7Ec6zAFaVSG3TpNAKtk4DOHNpSwKHxxrsiw4GHKESGPs5njn/0sMCUMl2svV4wo4BK/rCP7juYz+zx+l6oeQ==" crossorigin="anonymous" referrerPolicy="no-referrer"/>`;
            const prismAssets = loadedPrismLanguages.has(lang) ? '' : `${prismBaseAssets}${prismComponents}`;
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
        .replace(/<strong><code>([\s\S]*?)<\/code>:(<\/strong>)/g, '<code><strong>$1</strong></code><strong>:$2')
        .replace(/<em>([^<]*?)<code>([^<]+)<\/code>([^<]*?)<\/em>/g, '<em>$1</em><code><em>$2</em></code><em>$3</em>')
        .replace(/<em>([^<]*?)<strong>([^<]+)<\/strong>([^<]*?)<\/em>/g, '<em>$1</em><strong><em>$2</em></strong><em>$3</em>')
        .replace(/<strong><code>([\s\S]*?)<\/code><\/strong>/g, '<code><strong>$1</strong></code>')
        .replace(
            /(<ul class="bulleted-list" dir="auto"><li[^>]*>[\s\S]*?)<\/li><\/ul>((?:<p class="" dir="auto">\s*\^[\s\S]*?<\/p>)+)/g,
            (_, listStart, annotations) => `${listStart}${annotations.replace(/(<p class="" dir="auto">) {4}/g, '$1')}</li></ul>`,
        )
        // The Markdown exporter writes a Notion image caption twice: once as
        // its alt text and once as the following paragraph.
        .replace(/(<figure class="image"[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption><\/figure>)<p class="" dir="auto">\2<\/p>/g, '$1')
        .replace(/(<figcaption>([\s\S]*?)<\/figcaption>)<figcaption>\2<\/figcaption>/g, '$1');
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
