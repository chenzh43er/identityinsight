const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const KEEP = path.join(ROOT, 'index.html');
const RE = /<script src="[^"]*googlePath\.js"><\/script>\s*\r?\n?/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let fixed = 0;
for (const file of walk(ROOT)) {
  if (path.resolve(file) === KEEP) continue;
  const html = fs.readFileSync(file, 'utf8');
  const next = html.replace(RE, '');
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    fixed += 1;
    console.log('fixed:', path.relative(ROOT, file));
  }
}
console.log(`Removed googlePath from ${fixed} files.`);
