import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function checkFile(filePath, relPath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const titles = (content.match(/<title>[\s\S]*?<\/title>/gi) || []);
  const descriptions = (content.match(/<meta\s+[^>]*name=["']description["'][^>]*>/gi) || []);
  const canonicals = (content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || []);
  
  const rootMatch = content.match(/<div id="root">([\s\S]*?)<\/div>\s*<\/body>/i);
  let rootHasHeadTags = false;
  if (rootMatch) {
    if (/<(meta|link\s+rel="canonical"|title)/i.test(rootMatch[1])) {
      rootHasHeadTags = true;
    }
  }

  const isPass = (titles.length === 1 && descriptions.length === 1 && canonicals.length === 1 && !rootHasHeadTags);
  
  if (!isPass) {
    console.log(`[FAIL] ${relPath}: Titles=${titles.length}, Descriptions=${descriptions.length}, Canonicals=${canonicals.length}, RootHeadTags=${rootHasHeadTags}`);
  } else {
    console.log(`[PASS] ${relPath} -> Canonical: ${canonicals[0]}`);
  }
  return isPass;
}

function walk(dir, baseDir = dir) {
  let allPass = true;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'assets') {
      const res = walk(fullPath, baseDir);
      if (!res) allPass = false;
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      count++;
      const relPath = path.relative(baseDir, fullPath);
      const passed = checkFile(fullPath, relPath);
      if (!passed) allPass = false;
    }
  }
  return allPass;
}

const passed = walk(distDir);
console.log('\n=======================================');
console.log('Overall Verification:', passed ? 'SUCCESS: ALL HTML FILES HAVE EXACTLY 1 CANONICAL, 1 DESCRIPTION, 1 TITLE' : 'FAILED');
console.log('=======================================\n');
