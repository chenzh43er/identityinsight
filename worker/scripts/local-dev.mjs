import http from "node:http";
import https from "node:https";

const ORIGIN = "https://identityinsight.org";
const PORT = 8787;

function resolveTarget(pathname, search) {
  return `${ORIGIN}${pathname}${search}`;
}

function proxy(targetUrl, clientReq, clientRes) {
  const target = new URL(targetUrl);
  const headers = { ...clientReq.headers, host: target.host };
  delete headers["connection"];

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
    clientRes.writeHead(502, { "Content-Type": "text/plain" });
    clientRes.end(`Proxy error: ${err.message}`);
  });

  clientReq.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  proxy(resolveTarget(url.pathname, url.search), req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Local worker proxy ready on http://127.0.0.1:${PORT}`);
});
