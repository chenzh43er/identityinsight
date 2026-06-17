/**
 * Deduplicate identical static assets into /shared and rewrite references.
 * Run: node scripts/deduplicate-shared.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARED = path.join(ROOT, 'shared');
const LANGS = ['en', 'de', 'fr', 'es', 'pt', 'ar', 'no', 'jp', 'sv', 'nl'];
const LANG_GOOGLE_ADV_I18N = new Set(['fr', 'es', 'pt', 'ar', 'no', 'jp']);
const SOURCE_LANG = 'en';

const COPY_MAP = [
  ['testname/js/jquery.min.js', 'js/jquery.min.js'],
  ['testname/js/common.js', 'js/common.js'],
  ['testname/js/google_adv.js', 'js/google_adv.js'],
  ['testname/js/footJs.js', 'js/footJs.js'],
  ['testname/css/one.css', 'css/one.css'],
  ['testname/css/common.css', 'css/common.css'],
  ['testname/css/all.min.css', 'css/all.min.css'],
  ['testname/css/style.css', 'css/style.css'],
  ['headerJs.js', 'js/header.js'],
  ['list/headerJs.js', 'js/header.list.js'],
  ['horoscope/js/headerJs.js', 'js/header.horoscope.js'],
  ['horoscope/js/common.js', 'horoscope/js/common.js'],
  ['horoscope/js/utlParam.js', 'horoscope/js/utlParam.js'],
  ['horoscope/js/footJs.js', 'js/footJs.js'],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else copyFile(from, to);
  }
}

function setupSharedAssets() {
  const base = path.join(ROOT, SOURCE_LANG);

  for (const [fromRel, toRel] of COPY_MAP) {
    const src = path.join(base, fromRel);
    if (!fs.existsSync(src)) {
      console.warn('skip missing:', fromRel);
      continue;
    }
    copyFile(src, path.join(SHARED, toRel));
  }

  copyFile(
    path.join(ROOT, 'fr', 'testname/js/google_adv.js'),
    path.join(SHARED, 'js/google_adv.i18n.js')
  );
  copyFile(
    path.join(ROOT, 'jp', 'testname/js/footJs.js'),
    path.join(SHARED, 'js/footJs.jp.js')
  );

  copyDir(path.join(base, 'horoscope/js'), path.join(SHARED, 'horoscope/js'));
  copyDir(path.join(base, 'horoscope/css'), path.join(SHARED, 'horoscope/css'));

  const iconSrc = path.join(ROOT, 'testname', 'img', 'icon');
  if (fs.existsSync(iconSrc)) {
    copyDir(iconSrc, path.join(SHARED, 'img/icon'));
  }

  const rootHeader = path.join(ROOT, 'testname/js/headerJs.js');
  if (fs.existsSync(rootHeader)) {
    copyFile(rootHeader, path.join(SHARED, 'js/header.root.js'));
  }

  console.log('Shared assets created under /shared');
}

function detectLang(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lang = rel.split('/')[0];
  return LANGS.includes(lang) ? lang : null;
}

function detectPageType(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel.includes('/horoscope/')) return 'horoscope';
  if (rel.includes('/list/')) return 'list';
  return 'root';
}

function googleAdvPath(lang) {
  return LANG_GOOGLE_ADV_I18N.has(lang)
    ? '/shared/js/google_adv.i18n.js'
    : '/shared/js/google_adv.js';
}

function footJsPath(lang) {
  return lang === 'jp' ? '/shared/js/footJs.jp.js' : '/shared/js/footJs.js';
}

function headerJsPath(pageType) {
  if (pageType === 'horoscope') return '/shared/js/header.horoscope.js';
  if (pageType === 'list') return '/shared/js/header.list.js';
  return '/shared/js/header.js';
}

function rewriteContent(content, ctx) {
  let out = content;

  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/jquery\.min\.js(\?V=20200214)?/g, '/shared/js/jquery.min.js$1');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/common\.js/g, '/shared/js/common.js');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/google_adv\.js/g, googleAdvPath(ctx.lang));
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/footJs\.js/g, footJsPath(ctx.lang));
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/css\/one\.css/g, '/shared/css/one.css');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/css\/common\.css/g, '/shared/css/common.css');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/css\/all\.min\.css/g, '/shared/css/all.min.css');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/css\/style\.css/g, '/shared/css/style.css');

  out = out.replace(/\/testname\/img\/icon\//g, '/shared/img/icon/');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/img\/icon\//g, '/shared/img/icon/');

  if (ctx.pageType === 'horoscope') {
    out = out.replace(/href="\.\/css\//g, 'href="/shared/horoscope/css/');
    out = out.replace(/src="\.\/js\/common\.js"/g, 'src="/shared/horoscope/js/common.js"');
    out = out.replace(/src="\.\/js\/utlParam\.js"/g, 'src="/shared/horoscope/js/utlParam.js"');
    out = out.replace(/src="\.\/js\/footJs\.js"/g, `src="${footJsPath(ctx.lang)}"`);
    out = out.replace(/src="\.\/js\/headerJs\.js"/g, 'src="/shared/js/header.horoscope.js"');
    out = out.replace(/`\.\/js\//g, '`/shared/horoscope/js/');
    out = out.replace(/'\.\/js\//g, "'/shared/horoscope/js/");
  }

  const headerTarget = headerJsPath(ctx.pageType);
  out = out.replace(/src="headerJs\.js"/g, `src="${headerTarget}"`);
  out = out.replace(/src='headerJs\.js'/g, `src='${headerTarget}'`);

  return out;
}

function walkFiles(dir, exts, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'shared', 'scripts', 'worker'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, exts, files);
    else if (exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
  }
  return files;
}

function rewriteReferences() {
  const files = walkFiles(ROOT, ['.html', '.js', '.css']);
  let updated = 0;

  for (const file of files) {
    const lang = detectLang(file);
    if (!lang) {
      if (path.basename(file) === 'index.html' && path.dirname(file) === ROOT) {
        const original = fs.readFileSync(file, 'utf8');
        const next = rewriteContent(original, { lang: 'en', pageType: 'root' })
          .replace(/src="\.\/testname\/js\/headerJs\.js"/g, 'src="/shared/js/header.root.js"');
        if (next !== original) {
          fs.writeFileSync(file, next, 'utf8');
          updated += 1;
        }
      }
      continue;
    }

    const original = fs.readFileSync(file, 'utf8');
    const next = rewriteContent(original, {
      lang,
      pageType: detectPageType(file),
    });

    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      updated += 1;
    }
  }

  console.log(`Rewrote references in ${updated} files.`);
}

function removeIfExists(target) {
  if (!fs.existsSync(target)) return false;
  fs.rmSync(target, { recursive: true, force: true });
  return true;
}

function cleanupDuplicates() {
  const perLangFiles = [
    'testname/js/jquery.min.js',
    'testname/js/common.js',
    'testname/js/google_adv.js',
    'testname/js/footJs.js',
    'testname/css/one.css',
    'testname/css/common.css',
    'testname/css/all.min.css',
    'testname/css/style.css',
    'testname/js/headerJs.js',
    'headerJs.js',
    'list/headerJs.js',
  ];
  const perLangDirs = ['horoscope/js', 'horoscope/css'];

  let removed = 0;
  for (const lang of LANGS) {
    for (const rel of perLangFiles) {
      if (removeIfExists(path.join(ROOT, lang, rel))) removed += 1;
    }
    for (const rel of perLangDirs) {
      if (removeIfExists(path.join(ROOT, lang, rel))) removed += 1;
    }
  }

  const rootDupes = [
    'testname/js/jquery.min.js',
    'testname/js/common.js',
    'testname/js/google_adv.js',
    'testname/js/footJs.js',
    'testname/css/one.css',
    'testname/css/common.css',
    'testname/css/all.min.css',
    'testname/css/style.css',
  ];
  for (const rel of rootDupes) {
    if (removeIfExists(path.join(ROOT, rel))) removed += 1;
  }

  console.log(`Removed ${removed} duplicate files/directories.`);
}

function main() {
  setupSharedAssets();
  rewriteReferences();
  cleanupDuplicates();
  console.log('Done. Public assets are now under /shared');
}

main();
