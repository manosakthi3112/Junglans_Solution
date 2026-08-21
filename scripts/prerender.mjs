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
    /<title>[\s\S]*?<\/title>/gi,
    /<meta\s+name=["']description["'][^>]*>/gi,
    /<meta\s+name=["']keywords["'][^>]*>/gi,
    /<meta\s+name=["']robots["'][^>]*>/gi,
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi,
    /<link\s+rel=["']canonical["'][^>]*>/gi,
    /<meta\s+property=["']og:[^"']*["'][^>]*>/gi,
    /<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi,
    /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi
  ];
  patterns.forEach((re) => {
    let m;
    while ((m = re.exec(rendered)) !== null) {
      if (!tags.includes(m[0])) tags.push(m[0]);
    }
  });
  return tags;
}

function cleanHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');
}

for (const route of routes) {
  const rendered = render(route);
  const headTags = extractHeadTags(rendered);
  let bodyWithoutHeadTags = rendered;
  for (const tag of headTags) {
    bodyWithoutHeadTags = bodyWithoutHeadTags.replaceAll(tag, '');
  }
  
  // Clean all metadata/link/title tags from inside root body
  bodyWithoutHeadTags = bodyWithoutHeadTags
    .replace(/<link\s+[^>]*>/gi, '')
    .replace(/<meta\s+[^>]*>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  const headCleaned = cleanHead(template);
  const formattedHeadTags = headTags.join('\n  ');
  const html = headCleaned
    .replace('</head>', `  ${formattedHeadTags}\n</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root">${bodyWithoutHeadTags}</div>`
    );

  const outPath = route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`  prerendered ${route}`);
}

console.log(`Done: ${routes.length} pages prerendered into dist/`);
