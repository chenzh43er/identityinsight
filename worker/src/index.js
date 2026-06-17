const ORIGIN = "https://identityinsight.org";

function isLocalDev(request, env, url) {
  if (env.LOCAL_DEV === "true") return true;
  const host = request.headers.get("host") ?? url.host;
  const hostname = host.split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1";
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

function passThrough(request, env, url) {
  if (isLocalDev(request, env, url)) return fetchFromOrigin(request, env, url);
  return fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    return passThrough(request, env, url);
  },
};
