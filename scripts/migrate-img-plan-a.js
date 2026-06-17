/**
 * Plan A: Flatten all per-locale images into root testname/img/ and horoscope/img/
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['ar', 'de', 'en', 'es', 'fr', 'jp', 'nl', 'no', 'pt', 'sv'];
const IMG_SUBDIR_RE = /^[a-z]{2}_img$/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function mergeTestnameImg() {
  const destRoot = path.join(ROOT, 'testname', 'img');
  ensureDir(destRoot);
  let copied = 0;

  for (const lang of LANGS) {
    const srcRoot = path.join(ROOT, lang, 'testname', 'img');
    if (!fs.existsSync(srcRoot)) continue;

    for (const entry of fs.readdirSync(srcRoot, { withFileTypes: true })) {
      const srcPath = path.join(srcRoot, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'icon') {
          for (const file of walkFiles(srcPath)) {
            const rel = path.relative(srcPath, file);
            copyFile(file, path.join(destRoot, 'icon', rel));
            copied++;
          }
        } else if (IMG_SUBDIR_RE.test(entry.name)) {
          for (const file of walkFiles(srcPath)) {
            const rel = path.relative(srcPath, file);
            copyFile(file, path.join(destRoot, rel));
            copied++;
          }
        }
      } else if (entry.isFile()) {
        copyFile(srcPath, path.join(destRoot, entry.name));
        copied++;
      }
    }
  }

  return copied;
}

function mergeHoroscopeImg() {
  const destRoot = path.join(ROOT, 'horoscope', 'img');
  ensureDir(destRoot);
  let copied = 0;

  for (const lang of LANGS) {
    const srcRoot = path.join(ROOT, lang, 'horoscope', 'img');
    if (!fs.existsSync(srcRoot)) continue;

    for (const file of walkFiles(srcRoot)) {
      const rel = path.relative(srcRoot, file);
      copyFile(file, path.join(destRoot, rel));
      copied++;
    }
  }

  return copied;
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

function updateContent(content) {
  let next = content;

  // testname/img/{lang}_img/ -> /testname/img/
  next = next.replace(/(?:\.\.\/|\.\/)?testname\/\/img\/[a-z]{2}_img\//g, '/testname/img/');
  next = next.replace(/\/testname\/img\/[a-z]{2}_img\//g, '/testname/img/');

  // relative testname/img paths -> absolute
  next = next.replace(/\.\.\/testname\/\/img\//g, '/testname/img/');
  next = next.replace(/\.\/testname\/\/img\//g, '/testname/img/');
  next = next.replace(/\.\.\/testname\/img\//g, '/testname/img/');
  next = next.replace(/\.\/testname\/img\//g, '/testname/img/');

  // horoscope local img paths
  next = next.replace(/"\.\/img\//g, '"/horoscope/img/');
  next = next.replace(/'\.\/img\//g, "'/horoscope/img/");
  next = next.replace(/src="\.\/img\//g, 'src="/horoscope/img/');
  next = next.replace(/src='\.\/img\//g, "src='/horoscope/img/");

  return next;
}

function updateCodeFiles() {
  const exts = new Set(['.html', '.js', '.css', '.json']);
  let filesChanged = 0;

  for (const file of walkFiles(ROOT)) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith('node_modules' + path.sep) || rel.startsWith('scripts' + path.sep)) continue;
    if (!exts.has(path.extname(file))) continue;

    const original = fs.readFileSync(file, 'utf8');
    const updated = updateContent(original);
    if (updated !== original) {
      fs.writeFileSync(file, updated, 'utf8');
      filesChanged++;
    }
  }

  return filesChanged;
}

function removeLocaleImgDirs() {
  let removed = 0;

  for (const lang of LANGS) {
    for (const sub of ['testname/img', 'horoscope/img']) {
      const target = path.join(ROOT, lang, sub);
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        removed++;
      }
    }
  }

  return removed;
}

function countMatches(pattern) {
  const re = new RegExp(pattern, 'g');
  let count = 0;
  const exts = new Set(['.html', '.js']);

  for (const file of walkFiles(ROOT)) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith('node_modules' + path.sep) || rel.startsWith('scripts' + path.sep)) continue;
    if (!exts.has(path.extname(file))) continue;
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(re);
    if (matches) count += matches.length;
  }

  return count;
}

console.log('=== Plan A: Image migration ===\n');

console.log('Step 1: Merging testname/img ...');
const testnameCopied = mergeTestnameImg();
console.log(`  Copied ${testnameCopied} files to testname/img/`);

console.log('Step 2: Merging horoscope/img ...');
const horoscopeCopied = mergeHoroscopeImg();
console.log(`  Copied ${horoscopeCopied} files to horoscope/img/`);

console.log('Step 3: Updating code references ...');
const filesChanged = updateCodeFiles();
console.log(`  Updated ${filesChanged} files`);

console.log('Step 4: Removing per-locale img directories ...');
const dirsRemoved = removeLocaleImgDirs();
console.log(`  Removed ${dirsRemoved} directories`);

const rootTestnameCount = walkFiles(path.join(ROOT, 'testname', 'img')).length;
const rootHoroscopeCount = fs.existsSync(path.join(ROOT, 'horoscope', 'img'))
  ? walkFiles(path.join(ROOT, 'horoscope', 'img')).length
  : 0;

console.log('\n=== Verification ===');
console.log(`Root testname/img files: ${rootTestnameCount}`);
console.log(`Root horoscope/img files: ${rootHoroscopeCount}`);
console.log(`Remaining ./testname/img/ refs: ${countMatches(String.raw`\./testname/img/`)}`);
console.log(`Remaining ../testname/img/ refs: ${countMatches(String.raw`\.\./testname/img/`)}`);
console.log(`Remaining xx_img refs: ${countMatches(String.raw`testname/img/[a-z]{2}_img/`)}`);
console.log(`Remaining ./img/ refs: ${countMatches(String.raw`"\./img/`)}`);

console.log('\nDone.');
