import fs from 'fs';
const txt=fs.readFileSync('src/data/blogsData.js','utf8');
const dates=[...txt.matchAll(/publishDate:\s*"([^"]+)"/g)].map(m=>m[1]);
console.log(dates.slice(0,5));
const blogHtml=fs.readFileSync('dist/blog/classification-metrics-guide/index.html','utf8');
console.log('has Article', blogHtml.includes('Article'));
console.log('has canonical', blogHtml.includes('canonical'));
console.log('has datePublished', blogHtml.includes('datePublished'));
