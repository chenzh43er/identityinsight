const ORIGIN = "https://identityinsight.org";

// Known cloud/hosting ASNs — mirrors WAF Rule 1 (Block datacenter traffic)
const CLOUD_ASNS = new Set([
  16509, 14618, 15169, 396982, 8075, 8068, 8069, 14061, 16276, 24940,
  20473, 63949, 31898, 12876, 45102, 37963, 132203, 45090, 20940, 54600,
  47583, 51167, 62240, 46606, 36351, 35916, 36352, 60781, 29802, 60068,
  51177, 9009, 2635, 14117, 4134,
]);

const LANGS = new Set(["en", "de", "fr", "es", "pt", "ar", "no", "jp", "sv", "nl"]);
const CATEGORIES = new Set([
  "daily", "weekly", "monthly", "yearly", "love", "health", "career", "sex", "zodiac-love",
]);

function isLocalDev(request, env, url) {
  if (env.LOCAL_DEV === "true") return true;
  const host = request.headers.get("host") ?? url.host;
  const hostname = host.split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1";
}

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

function fetchFromOrigin(request, env, url, target) {
  const targetUrl = target ?? new URL(url.pathname + url.search, ORIGIN).toString();
  if (isLocalDev(request, env, url)) {
    return fetch(targetUrl, {
      method: request.method,
      headers: {
        Accept: request.headers.get("Accept") ?? "*/*",
        "Accept-Encoding": request.headers.get("Accept-Encoding") ?? "gzip, deflate, br",
        "Accept-Language": request.headers.get("Accept-Language") ?? "en",
      },
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      redirect: "follow",
    });
  }
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
  });
}

async function serveLocalAssets(request, env, url) {
  const mappedPath = mapHoroscopeRoute(url.pathname);
  const assetUrl = new URL(mappedPath + url.search, url.origin);

  if (shouldProxyToOrigin(url.pathname)) {
    return fetchFromOrigin(request, env, url);
  }

  let response = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));

  if (response.status === 404 && !url.pathname.endsWith(".html")) {
    const htmlUrl = new URL(mappedPath.endsWith(".html") ? mappedPath : `${mappedPath}.html`, url.origin);
    response = await env.ASSETS.fetch(new Request(htmlUrl.toString() + url.search, request));
  }

  if (response.status === 404) {
    return fetchFromOrigin(request, env, url);
  }

  return response;
}

function isVerifiedBot(request) {
  const cf = request.cf;
  if (!cf) return false;
  return Boolean(cf.botManagement?.verifiedBot || cf.verifiedBotCategory);
}

function shouldBlockDatacenter(request, env, url) {
  if (isLocalDev(request, env, url)) return false;
  if (isVerifiedBot(request)) return false;
  const asn = request.cf?.asn;
  return typeof asn === "number" && CLOUD_ASNS.has(asn);
}

function passThrough(request, env, url) {
  if (isLocalDev(request, env, url) && env.ASSETS) {
    return serveLocalAssets(request, env, url);
  }
  if (isLocalDev(request, env, url)) return fetchFromOrigin(request, env, url);
  return fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldBlockDatacenter(request, env, url)) {
      return new Response("Forbidden", { status: 403 });
    }

    return passThrough(request, env, url);
  },
};
