/**
 * Fix horoscopeDetail.html: broken menu toggle JS + robust URL parsing.
 * Run: node scripts/fix-horoscope-detail.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'de', 'fr', 'es', 'pt', 'ar', 'no', 'jp', 'sv', 'nl'];

const PATH_PARSE_RE = /const segments = window\.location\.pathname\.split\('\/'\)\.filter\(s => s !== ''\);\s*const HORO_CATS = new Set\(\['daily','weekly','monthly','yearly','love','health','career','sex','zodiac-love'\]\);\s*(?:\/\/[^\n]*\n\s*)?let horo = segments\[2\];\s*let cat = segments\[3\];\s*if \(horo && HORO_CATS\.has\(horo\.toLowerCase\(\)\)\) \{\s*\[horo, cat\] = \[cat, horo\];\s*\}/;

const PATH_PARSE_NEW = `const segments = window.location.pathname.split('/').filter(s => s !== '');
      const HORO_CATS = new Set(['daily','weekly','monthly','yearly','love','health','career','sex','zodiac-love']);
      const horoscopeIdx = segments.indexOf('horoscope');

      let horo;
      let cat;
      if (horoscopeIdx >= 0) {
        const a = segments[horoscopeIdx + 1] ?? '';
        const b = segments[horoscopeIdx + 2] ?? '';
        if (HORO_CATS.has(a.toLowerCase())) {
          cat = a;
          horo = b;
        } else if (HORO_CATS.has(b.toLowerCase())) {
          horo = a;
          cat = b;
        } else {
          horo = a;
          cat = b;
        }
      }`;

const LANG_FALLBACK_OLD = /return pathSegments\[1\] \|\| pathSegments\[0\] \|\| 'sv';/g;
const LANG_FALLBACK_NEW = "return 'en';";

const TOGGLE_LINE =
  "    toggle.textContent = isOpen ? '×' : '☰'; // 用字符切换：汉堡 ☰ X";

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  if (PATH_PARSE_RE.test(content)) {
    content = content.replace(PATH_PARSE_RE, PATH_PARSE_NEW);
  }

  content = content.replace(LANG_FALLBACK_OLD, LANG_FALLBACK_NEW);

  content = content.replace(
    /toggle\.textContent = isOpen \? '×' : '[^'\n]*;[^\n]*/g,
    TOGGLE_LINE,
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  let updated = 0;
  for (const lang of LANGS) {
    const file = path.join(ROOT, lang, 'horoscope', 'horoscopeDetail.html');
    if (!fs.existsSync(file)) continue;
    if (fixFile(file)) {
      updated += 1;
      console.log('updated:', `${lang}/horoscope/horoscopeDetail.html`);
    }
  }
  console.log(`Done. Updated ${updated} files.`);
}

main();
