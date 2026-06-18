/**
 * Fix list page pic URL transforms after Plan A image migration.
 * Replaces legacy testCommon -> ./testname chains that keep xx_img subdirs.
 *
 * Run: node scripts/fix-list-pic-paths.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['ar', 'de', 'en', 'es', 'fr', 'jp', 'nl', 'no', 'pt', 'sv'];

const PIC_CHAIN_RE = /(\b(?:testData|item)\.pic)\s*=\s*(testData|item)\.pic(?:\s*\n\s*\.replace\("[^"]+","[^"]+"\))+[\s\n]*/g;

const INLINE_PIC_CHAIN_RE = /(\b(?:testData|item)\.pic)\s*=\s*(testData|item)\.pic(?:\s*\.replace\("[^"]+","[^"]+"\))+/g;

function isPicTransformChain(text) {
  return text.includes('testCommon') || text.includes('testname');
}

function replacementFor(varName, indent) {
  const pad = indent || '';
  return `${pad} = normalizePicUrl(${varName}.pic)\n`;
}

function fixContent(content) {
  let next = content;

  next = next.replace(PIC_CHAIN_RE, (match, lhs, varName) => {
    if (!isPicTransformChain(match)) return match;
    const indent = match.match(/\n(\s+)\.replace/)?.[1] || '                ';
    return `${lhs}${replacementFor(varName, indent)}`;
  });

  next = next.replace(INLINE_PIC_CHAIN_RE, (match, lhs, varName) => {
    if (!isPicTransformChain(match)) return match;
    return `${lhs} = normalizePicUrl(${varName}.pic)`;
  });

  return next;
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

function collectTargetFiles() {
  const files = new Set();

  for (const lang of LANGS) {
    const listHtml = path.join(ROOT, lang, 'list.html');
    if (fs.existsSync(listHtml)) files.add(listHtml);

    const listDir = path.join(ROOT, lang, 'list');
    if (fs.existsSync(listDir)) {
      for (const name of fs.readdirSync(listDir)) {
        if (name.endsWith('.html')) files.add(path.join(listDir, name));
      }
    }

    const listJs = path.join(ROOT, lang, 'testname', 'js', 'PageJsEn', 'list.js');
    if (fs.existsSync(listJs)) files.add(listJs);
  }

  const rootListJs = path.join(ROOT, 'testname', 'js', 'PageJsEn', 'list.js');
  if (fs.existsSync(rootListJs)) files.add(rootListJs);

  return [...files];
}

function ensureCommonJsLoaded(content) {
  if (!content.includes('normalizePicUrl(')) return content;
  if (content.includes('/shared/js/common.js')) return content;

  const jqueryRe = /(<script src="\/shared\/js\/jquery\.min\.js[^"]*"><\/script>\s*\n)/;
  if (jqueryRe.test(content)) {
    return content.replace(jqueryRe, '$1<script src="/shared/js/common.js"></script>\n');
  }

  const googleAdvRe = /(<script src="\/shared\/js\/google_adv(?:\.i18n)?\.js"><\/script>\s*\n)/;
  if (googleAdvRe.test(content)) {
    return content.replace(googleAdvRe, '$1<script src="/shared/js/common.js"></script>\n');
  }

  return content;
}

function main() {
  const targets = collectTargetFiles();
  let updated = 0;

  for (const file of targets) {
    const original = fs.readFileSync(file, 'utf8');
    let next = fixContent(original);
    next = ensureCommonJsLoaded(next);

    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      updated += 1;
      console.log('updated:', path.relative(ROOT, file).replace(/\\/g, '/'));
    }
  }

  console.log(`\nDone. Updated ${updated} list files.`);
}

main();
