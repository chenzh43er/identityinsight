import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ORIGIN = "https://identityinsight.org";
const PORT = 8787;

const LANGS = new Set(["en", "de", "fr", "es", "pt", "ar", "no", "jp", "sv", "nl"]);
const CATEGORIES = new Set([
  "daily", "weekly", "monthly", "yearly", "love", "health", "career", "sex", "zodiac-love",
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webmanifest": "application/manifest+json",
};

/** Proxy only paths that are not stored in this repo. */
function shouldProxyToOrigin(pathname) {
  return (
    pathname.startsWith("/public/") ||
    pathname.startsWith("/testCommon4/")
  );
}

function isHoroscopeDetailPath(first, second) {
  const aCat = CATEGORIES.has(first.toLowerCase());
  const bCat = CATEGORIES.has(second.toLowerCase());
  return (aCat && !bCat) || (!aCat && bCat);
}

function mapHoroscopeRoute(pathname) {
  const rootDetail = pathname.match(/^\/horoscope\/([^/]+)\/([^/]+)\/?$/i);
  if (rootDetail && isHoroscopeDetailPath(rootDetail[1], rootDetail[2])) {
    return "/en/horoscope/horoscopeDetail.html";
  }

  const detail = pathname.match(/^\/([a-z]{2})\/horoscope\/([^/]+)\/([^/]+)\/?$/i);
  if (detail && LANGS.has(detail[1])) {
    if (isHoroscopeDetailPath(detail[2], detail[3])) {
      return `/${detail[1]}/horoscope/horoscopeDetail.html`;
    }
  }

  const category = pathname.match(/^\/([a-z]{2})\/horoscope\/([^/]+)\/?$/i);
  if (category && LANGS.has(category[1])) {
    if (CATEGORIES.has(category[2].toLowerCase())) {
      return `/${category[1]}/horoscope/selectHoroCat.html`;
    }
  }

  const index = pathname.match(/^\/([a-z]{2})\/horoscope\/?$/i);
  if (index && LANGS.has(index[1])) {
    return `/${index[1]}/horoscope/selectHoro.html`;
  }

  return pathname;
}

/** Map lang-scoped horoscope asset URLs to repo root paths. */
function mapHoroscopeAssetPath(pathname) {
  const langAsset = pathname.match(
    /^\/([a-z]{2})\/horoscope\/(img|css|js)\/(.+)$/i,
  );
  if (langAsset && LANGS.has(langAsset[1])) {
    if (langAsset[2] === "img") {
      return `/horoscope/img/${langAsset[3]}`;
    }
    if (langAsset[2] === "css") {
      return `/shared/horoscope/css/${langAsset[3]}`;
    }
    if (langAsset[2] === "js") {
      return `/shared/horoscope/js/${langAsset[3]}`;
    }
  }
  return pathname;
}

function resolveFilePath(pathname) {
  let mapped = mapHoroscopeAssetPath(mapHoroscopeRoute(pathname));
  if (mapped.endsWith("/")) mapped = mapped.slice(0, -1);
  if (mapped === "" || mapped === "/") mapped = "/index.html";

  const rel = mapped.startsWith("/") ? mapped.slice(1) : mapped;
  let filePath = path.join(ROOT, rel.split("/").join(path.sep));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath += ".html";
  }

  return filePath;
}

function proxyToOrigin(clientReq, clientRes, targetUrl) {
  const target = new URL(targetUrl);
  const headers = { ...clientReq.headers, host: target.host };
  delete headers.connection;

  const proxyReq = https.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || 443,
      path: target.pathname + target.search,
      method: clientReq.method,
      headers,
    },
    (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    },
  );

  proxyReq.on("error", (err) => {
    clientRes.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    clientRes.end(`Proxy error: ${err.message}`);
  });

  if (clientReq.method !== "GET" && clientReq.method !== "HEAD") {
    clientReq.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
}

function serveLocalFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] ?? "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  if (shouldProxyToOrigin(pathname)) {
    proxyToOrigin(req, res, `${ORIGIN}${pathname}${url.search}`);
    return;
  }

  const filePath = resolveFilePath(pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveLocalFile(filePath, res);
    return;
  }

  // Fallback: missing assets (images etc.) from production
  proxyToOrigin(req, res, `${ORIGIN}${pathname}${url.search}`);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Local static dev server: http://127.0.0.1:${PORT}`);
  console.log(`Serving files from: ${ROOT}`);
  console.log("Horoscope routes map to local HTML; missing assets fall back to origin.");
});
