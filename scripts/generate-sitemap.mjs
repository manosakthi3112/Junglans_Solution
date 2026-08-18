import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projectsData.js';
import { blogsData } from '../src/data/blogsData.js';

const SITE_URL = 'https://www.junglans.in';
const today = new Date().toISOString().split('T')[0];

const paths = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/blogs', priority: '0.8', freq: 'weekly' },
  { path: '/team', priority: '0.5', freq: 'monthly' },
  { path: '/security', priority: '0.7', freq: 'monthly' }
];

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
