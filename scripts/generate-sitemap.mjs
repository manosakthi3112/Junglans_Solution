import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projectsData.js';
import { blogsData } from '../src/data/blogsData.js';
import { packagesData } from '../src/data/packagesData.js';

const SITE_URL = 'https://www.junglans.in';
const today = new Date().toISOString().split('T')[0];

const paths = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/ai-software-development', priority: '0.9', freq: 'weekly' },
  { path: '/enterprise-ai', priority: '0.9', freq: 'weekly' },
  { path: '/local-first-software', priority: '0.9', freq: 'weekly' },
  { path: '/packages', priority: '0.9', freq: 'weekly' },
  { path: '/blogs', priority: '0.8', freq: 'weekly' },
  { path: '/team', priority: '0.7', freq: 'monthly' },
  { path: '/contact', priority: '0.8', freq: 'monthly' },
  { path: '/privacy', priority: '0.3', freq: 'yearly' },
  { path: '/terms', priority: '0.3', freq: 'yearly' }
];

packagesData.forEach((p) => {
  paths.push({ path: `/packages/${p.slug}`, priority: '0.9', freq: 'weekly' });
});

projectsData.forEach((p) => {
  paths.push({ path: `/project/${p.id}`, priority: '0.9', freq: 'monthly' });
});

blogsData.forEach((b) => {
  paths.push({ path: `/blog/${b.slug}`, priority: '0.7', freq: 'monthly' });
});

const urls = paths
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml written: ${paths.length} URLs -> ${out}`);
