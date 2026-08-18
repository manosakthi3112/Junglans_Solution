import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projectsData.js';
import { blogsData } from '../src/data/blogsData.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://www.junglans.in';
const key = readFileSync(join(root, 'public', `${process.env.INDEXNOW_KEY || 'e8156172fd9e962f4ec405c46afb398e'}.txt`), 'utf8').trim();

const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/blogs`,
  `${SITE_URL}/team`,
  `${SITE_URL}/security`,
  ...projectsData.map((p) => `${SITE_URL}/project/${p.id}`),
  ...blogsData.map((b) => `${SITE_URL}/blog/${b.slug}`)
];

const payload = { host: 'www.junglans.in', key, keyLocation: `${SITE_URL}/${key}.txt`, urlList: urls };

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

console.log(`IndexNow response: ${res.status} ${res.statusText}`);
if (res.status === 200) console.log(`Submitted ${urls.length} URLs to Bing/Yandex/Seznam.`);
else console.log(await res.text());