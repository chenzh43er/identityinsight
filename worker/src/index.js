const ORIGIN = "https://identityinsight.org";

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
    return passThrough(request, env, url);
  },
};
