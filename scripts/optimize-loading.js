/**
 * Batch-optimize HTML loading: move render-blocking scripts out of <head>,
 * defer non-critical scripts, add preconnect hints.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const BLOCKING_SCRIPT_RE =
  /<script\s+src="([^"]*(?:jquery\.min\.js|google_adv\.js|common\.js)[^"]*)"\s*><\/script>\s*\n?/gi;

const FOOT_HEADER_ASYNC_RE =
  /<script\s+src="([^"]*(?:footJs\.js|headerJs\.js))"\s+async\s*><\/script>/gi;

const FOOT_HEADER_SYNC_RE =
  /<script\s+src="([^"]*(?:footJs\.js|headerJs\.js))"\s*><\/script>/gi;

const COOKIEBOT_RE =
  /<script\s+id="Cookiebot"[^>]*src="https:\/\/consent\.cookiebot\.com\/uc\.js"[^>]*>\s*<\/script>\s*\n?/gi;

const PRECONNECT_BLOCK = `  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://consent.cookiebot.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://consent.cookiebot.com">
`;

const MARKER = '<!-- perf:scripts -->';

function walkHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'scripts') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function findBodyScriptInsertIndex(html) {
  const headEnd = html.indexOf('</head>');
  if (headEnd === -1) {
    return -1;
  }

  const body = html.slice(headEnd + 7);
  const scriptRe = /<script(?:\s[^>]*)?>|<script>/gi;
  let match;

  while ((match = scriptRe.exec(body)) !== null) {
    const start = headEnd + 7 + match.index;
    const tag = match[0];
    const after = html.slice(start, start + 500);

    if (/src="[^"]*adsbygoogle/i.test(after)) {
      continue;
    }
    if (/src="[^"]*(?:footJs|headerJs)/i.test(after)) {
      continue;
    }
    if (/Cookiebot/i.test(after)) {
      continue;
    }
    if (/googletagmanager\.com\/gtm\.js/i.test(after)) {
      continue;
    }

    if (tag === '<script>' || tag.startsWith('<script>')) {
      return start;
    }

    const srcMatch = after.match(/src="([^"]+)"/);
    if (srcMatch && /(?:jquery|google_adv|common|googlePath)/i.test(srcMatch[1])) {
      continue;
    }

    return start;
  }

  const bodyClose = html.lastIndexOf('</body>');
  return bodyClose === -1 ? -1 : bodyClose;
}

function ensurePreconnect(html) {
  if (html.includes('href="https://consent.cookiebot.com"')) {
    return html;
  }

  const viewportMatch = html.match(/<meta\s+name="viewport"[^>]*>\s*\n/i);
  if (viewportMatch) {
    const insertAt = viewportMatch.index + viewportMatch[0].length;
    return html.slice(0, insertAt) + PRECONNECT_BLOCK + html.slice(insertAt);
  }

  const charsetMatch = html.match(/<meta\s+charset="[^"]*">\s*\n/i);
  if (charsetMatch) {
    const insertAt = charsetMatch.index + charsetMatch[0].length;
    return html.slice(0, insertAt) + PRECONNECT_BLOCK + html.slice(insertAt);
  }

  return html;
}

function optimizeLogoImage(html) {
  return html.replace(
    /(<img\s+src="[^"]*title\.png")(\s*>)/gi,
    (full, prefix, suffix) => {
      if (/fetchpriority=/i.test(full)) {
        return full;
      }
      return `${prefix} fetchpriority="high" decoding="async"${suffix}`;
    }
  );
}

function makeGtmAsync(html) {
  return html.replace(
    /<!-- Google Tag Manager -->\s*\n\s*<script>(\(function\(w,d,s,l,i\)[\s\S]*?)<\/script>\s*\n\s*<!-- End Google Tag Manager -->/g,
    (block, gtmBody) => {
      if (block.includes('<script async>')) {
        return block;
      }
      return block.replace('<script>', '<script async>');
    }
  );
}

function optimizeHtml(html) {
  if (html.includes(MARKER)) {
    return { html, changed: false, reason: 'already optimized' };
  }

  let changed = false;
  const original = html;

  const blockingScripts = [];
  html = html.replace(BLOCKING_SCRIPT_RE, (full, src) => {
    if (full.includes('<head>') || html.indexOf(full) < html.indexOf('</head>')) {
      blockingScripts.push(full.trim());
      changed = true;
      return '';
    }
    return full;
  });

  // Re-run extraction scoped to head only
  const headEndIdx = html.indexOf('</head>');
  if (headEndIdx !== -1) {
    const head = html.slice(0, headEndIdx);
    const rest = html.slice(headEndIdx);
    const headScripts = [];
    const newHead = head.replace(BLOCKING_SCRIPT_RE, (full) => {
      headScripts.push(full.trim());
      changed = true;
      return '';
    });
    if (headScripts.length) {
      blockingScripts.push(...headScripts);
      html = newHead + rest;
    }
  }

  let cookiebotScript = '';
  html = html.replace(COOKIEBOT_RE, (full) => {
    cookiebotScript = full.trim().replace('<script ', '<script defer ');
    if (!cookiebotScript.includes(' defer ')) {
      cookiebotScript = cookiebotScript.replace('<script ', '<script defer ');
    }
    changed = true;
    return '';
  });

  html = html.replace(FOOT_HEADER_ASYNC_RE, (full, src) => {
    changed = true;
    return `<script defer src="${src}"></script>`;
  });

  html = html.replace(FOOT_HEADER_SYNC_RE, (full, src) => {
    changed = true;
    return `<script defer src="${src}"></script>`;
  });

  html = ensurePreconnect(html);
  html = makeGtmAsync(html);
  html = optimizeLogoImage(html);

  const bundle = [];
  if (blockingScripts.length) {
    bundle.push(...blockingScripts);
    changed = true;
  }

  if (bundle.length || cookiebotScript) {
    const insertAt = findBodyScriptInsertIndex(html);
    if (insertAt === -1) {
      return { html: original, changed: false, reason: 'no insert point' };
    }

    const parts = [MARKER];
    if (bundle.length) {
      parts.push(bundle.join('\n'));
    }
    if (cookiebotScript) {
      parts.push(cookiebotScript);
    }

    html = html.slice(0, insertAt) + parts.join('\n') + '\n' + html.slice(insertAt);
  }

  if (html !== original) {
    changed = true;
  }

  return { html, changed, reason: changed ? 'optimized' : 'unchanged' };
}

function main() {
  const files = walkHtmlFiles(ROOT);
  let updated = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const { html, changed, reason } = optimizeHtml(original);
    if (changed) {
      fs.writeFileSync(file, html, 'utf8');
      updated += 1;
      console.log(`updated: ${path.relative(ROOT, file)} (${reason})`);
    }
  }

  console.log(`\nDone. Updated ${updated}/${files.length} HTML files.`);
}

main();
