/**
 * Restore horoscopeDetail.html from production template (sign + category detail page).
 * Run: node scripts/restore-horoscope-detail.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'de', 'fr', 'es', 'pt', 'ar', 'no', 'jp', 'sv', 'nl'];
const SOURCE_URL =
  'https://identityinsight.org/en/horoscope/Aries/weekly/?campaign=horo';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchUrl(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

function prepareDetailHtml(html) {
  let out = html;
  if (!out.includes('messageForHoro')) {
    throw new Error('Downloaded HTML does not look like horoscope detail page');
  }

  const horoParseRe =
    /const horo = segments\[2\];\s*\/\/ "Leo"\s*let cat = segments\[3\];\s*\/\/ "daily"/;

  if (!horoParseRe.test(out)) {
    throw new Error('Could not find horo/cat parse block to patch');
  }

  out = out.replace(
    horoParseRe,
    `let horo = segments[2];
      let cat = segments[3];

      if (horo && HORO_CATS.has(horo.toLowerCase())) {
        [horo, cat] = [cat, horo];
      }
      horo = horo.charAt(0).toUpperCase() + horo.slice(1).toLowerCase();
      cat = cat.toLowerCase();`,
  );

  out = out.replace(
    "const segments = window.location.pathname.split('/').filter(s => s !== '');",
    `const segments = window.location.pathname.split('/').filter(s => s !== '');
      const HORO_CATS = new Set(['daily','weekly','monthly','yearly','love','health','career','sex','zodiac-love']);`,
  );
  return out;
}

async function main() {
  const localFallback = path.join(ROOT, '_prod_weekly.html');
  let html;
  try {
    console.log('Fetching production detail template...');
    html = await fetchUrl(SOURCE_URL);
  } catch (err) {
    if (!fs.existsSync(localFallback)) throw err;
    console.warn('Fetch failed, using local fallback:', err.message);
    html = fs.readFileSync(localFallback, 'utf8');
  }

  const detailHtml = prepareDetailHtml(html);
  let copied = 0;

  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang, 'horoscope');
    if (!fs.existsSync(dir)) continue;
    const target = path.join(dir, 'horoscopeDetail.html');
    fs.writeFileSync(target, detailHtml, 'utf8');
    copied += 1;
    console.log('restored:', `${lang}/horoscope/horoscopeDetail.html`);
  }

  console.log(`Done. Restored ${copied} horoscopeDetail.html files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
