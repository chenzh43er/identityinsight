/**
 * Fix mqqht/result page pic URL transforms after Plan A image migration.
 * Replaces legacy testCommon -> ./testname chains that keep xx_img subdirs.
 *
 * Run: node scripts/fix-mqqht-result-pic-paths.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['ar', 'de', 'en', 'es', 'fr', 'jp', 'nl', 'no', 'pt', 'sv'];

const REPLACE_CALL = String.raw`\.replace\("[^"]+"\s*,\s*"[^"]+"\)`;

const ASSIGN_CHAIN_RE = new RegExp(
  `(\\b(\\w+)\\.(pic|mainPic))\\s*=\\s*\\2\\.(?:pic|mainPic)(?:\\s*\\n\\s*${REPLACE_CALL})+`,
  'g'
);

const INLINE_ASSIGN_RE = new RegExp(
  `(\\b(\\w+)\\.(pic|mainPic))\\s*=\\s*\\2\\.(?:pic|mainPic)(?:\\s*${REPLACE_CALL})+`,
  'g'
);

const INLINE_EXPR_RE =
  /([\w.]+)\.replace\(\s*"https:\/\/identityinsight\.org\/testCommon\d+"\s*,\s*"(?:\.\.\/|\.\/)?testname"\s*\)(?:\s*\.replace\(\s*"gif"\s*,\s*"png"\s*\))?/g;

function fixContent(content) {
  let next = content;

  next = next.replace(ASSIGN_CHAIN_RE, '$1 = normalizePicUrl($2.$3)\n');

  next = next.replace(INLINE_ASSIGN_RE, '$1 = normalizePicUrl($2.$3)');

  next = next.replace(INLINE_EXPR_RE, 'normalizePicUrl($1)');

  next = next.replace(
    /^(\s*)(\w+\.mainPic = normalizePicUrl\([^)]+\))\n(document\.getElementById)/gm,
    function (_, indent, assign, nextLine) {
      return assign + '\n' + indent + nextLine;
    }
  );

  return next;
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

  const brokenCommonRe = /<script src="(?:\.\.\/|\.\/)?testname\/js\/common\.js"><\/script>/;
  if (brokenCommonRe.test(content)) {
    return content.replace(brokenCommonRe, '<script src="/shared/js/common.js"></script>');
  }

  return content;
}

function collectTargetFiles() {
  const files = new Set();
  const pageNames = ['mqqht.html', 'mqqhtImg.html', 'result.html', 'resultImg.html'];

  for (const lang of LANGS) {
    for (const name of pageNames) {
      const file = path.join(ROOT, lang, name);
      if (fs.existsSync(file)) files.add(file);
    }

    for (const jsName of ['mqqht.js', 'result.js']) {
      const jsFile = path.join(ROOT, lang, 'testname', 'js', 'PageJsEn', jsName);
      if (fs.existsSync(jsFile)) files.add(jsFile);
    }
  }

  for (const jsName of ['mqqht.js', 'result.js']) {
    const rootJs = path.join(ROOT, 'testname', 'js', 'PageJsEn', jsName);
    if (fs.existsSync(rootJs)) files.add(rootJs);
  }

  return [...files];
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

  console.log(`\nDone. Updated ${updated} mqqht/result files.`);
}

main();
