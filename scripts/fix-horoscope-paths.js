/**
 * Fix horoscope HTML asset paths for local dev and production.
 * Run: node scripts/fix-horoscope-paths.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'de', 'fr', 'es', 'pt', 'ar', 'no', 'jp', 'sv', 'nl'];
const LANG_GOOGLE_ADV_I18N = new Set(['fr', 'es', 'pt', 'ar', 'no', 'jp']);

function googleAdvPath(lang) {
  return LANG_GOOGLE_ADV_I18N.has(lang)
    ? '/shared/js/google_adv.i18n.js'
    : '/shared/js/google_adv.js';
}

function footJsPath(lang) {
  return lang === 'jp' ? '/shared/js/footJs.jp.js' : '/shared/js/footJs.js';
}

function rewriteHoroscopeHtml(content, lang) {
  let out = content;

  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/jquery\.min\.js(\?V=20200214)?/g, '/shared/js/jquery.min.js$1');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/common\.js/g, '/shared/js/common.js');
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/google_adv\.js/g, googleAdvPath(lang));
  out = out.replace(/(?:\.\.\/|\.\/)+testname\/js\/footJs\.js/g, footJsPath(lang));

  out = out.replace(/href="\.\/css\//g, 'href="/shared/horoscope/css/');
  out = out.replace(/src="\.\/js\/common\.js"/g, 'src="/shared/horoscope/js/common.js"');
  out = out.replace(/src="\.\/js\/utlParam\.js"/g, 'src="/shared/horoscope/js/utlParam.js"');
  out = out.replace(/src="\.\/js\/footJs\.js"/g, `src="${footJsPath(lang)}"`);
  out = out.replace(/src="\.\/js\/headerJs\.js"/g, 'src="/shared/js/header.horoscope.js"');
  out = out.replace(/`\.\/js\//g, '`/shared/horoscope/js/');
  out = out.replace(/'\.\/js\//g, "'/shared/horoscope/js/");

  out = out.replace(/src="\.\/img\//g, 'src="/horoscope/img/');
  out = out.replace(/src='\.\/img\//g, "src='/horoscope/img/");
  out = out.replace(/`\.\/img\//g, '`/horoscope/img/');

  out = out.replace(/src="(?:\.\.\/)+testname\/\/img\//g, 'src="/testname/img/');
  out = out.replace(/src="(?:\.\.\/)+testname\/img\//g, 'src="/testname/img/');

  return out;
}

function main() {
  let updated = 0;

  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang, 'horoscope');
    if (!fs.existsSync(dir)) continue;

    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.html')) continue;
      const file = path.join(dir, name);
      const original = fs.readFileSync(file, 'utf8');
      const next = rewriteHoroscopeHtml(original, lang);
      if (next !== original) {
        fs.writeFileSync(file, next, 'utf8');
        updated += 1;
        console.log('updated:', path.relative(ROOT, file).replace(/\\/g, '/'));
      }
    }
  }

  console.log(`Done. Updated ${updated} horoscope HTML files.`);
}

main();
