const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CDN_PREFIX = 'https://min1-b8s.pages.dev/public/js/';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'scripts') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function testnamePrefix(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const depth = Math.max(0, parts.length - 2);
  return depth === 0 ? './' : '../'.repeat(depth);
}

let updated = 0;
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(CDN_PREFIX)) continue;

  const prefix = `${testnamePrefix(file)}testname/js/`;
  const next = html.split(CDN_PREFIX).join(prefix);
  fs.writeFileSync(file, next, 'utf8');
  updated += 1;
  console.log('localized CDN:', path.relative(ROOT, file));
}

console.log(`\nLocalized ${updated} HTML files.`);
