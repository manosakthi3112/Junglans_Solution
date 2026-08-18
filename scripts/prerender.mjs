import { build } from 'vite';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projectsData } from '../src/data/projectsData.js';
import { blogsData } from '../src/data/blogsData.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const distServerDir = join(root, 'dist-server');

// 1. Client build
console.log('> Building client bundle...');
await build({});

// 2. SSR bundle
console.log('> Building SSR bundle...');
await build({
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist-server',
    emptyOutDir: true
  }
});

// 3. Render every route
const { render } = await import(pathToFileURL(join(distServerDir, 'entry-server.js')).href);
const template = readFileSync(join(distDir, 'index.html'), 'utf8');

const routes = [
  '/',
  '/blogs',
  '/team',
  '/security',
  ...projectsData.map((p) => `/project/${p.id}`),
  ...blogsData.map((b) => `/blog/${b.slug}`)
];

function extractHeadTags(rendered) {
  const tags = [];
  const patterns = [
    /<title>[\s\S]*?<\/title>/g,
    /<meta[^>]*>/g,
    /<link[^>]*rel="canonical"[^>]*>/g,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/g
  ];
  patterns.forEach((re) => {
    let m;
    while ((m = re.exec(rendered)) !== null) tags.push(m[0]);
  });
  return tags;
}

function cleanHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[^>]*>/, '')
    .replace(/<meta\s+name="keywords"[^>]*>/, '')
    .replace(/<meta\s+name="robots"[^>]*>/, '')
    .replace(/<link\s+rel="canonical"[^>]*>/, '')
    .replace(/<meta\s+property="og:[^>]*>/g, '')
    .replace(/<meta\s+name="twitter:[^>]*>/g, '');
}

for (const route of routes) {
  const rendered = render(route);
  const headTags = extractHeadTags(rendered);
  const bodyWithoutHeadTags = headTags.reduce((acc, tag) => acc.replace(tag, ''), rendered);
  const head = cleanHead(template);
  const html = head.replace('</head>', `${headTags.join('\n  ')}\n</head>`).replace(
    '<div id="root"></div>',
    `<div id="root">${bodyWithoutHeadTags}</div>`
  );

  const outPath = route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`  prerendered ${route}`);
}

console.log(`Done: ${routes.length} pages prerendered into dist/`);
