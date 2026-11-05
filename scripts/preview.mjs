import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };

// Serve the actual static build, including real 404s. Never rewrite unknown URLs to Home.
export function createPreviewServer(directory = "dist") {
  const root = resolve(directory);
  return createServer(async (request, response) => {
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        response.writeHead(405, { Allow: "GET, HEAD" }).end(); return;
      }
      const url = new URL(request.url, "http://localhost");
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); }
      catch { response.writeHead(400).end("Invalid URL"); return; }
      let file = resolve(root, `.${pathname}`);
      if (pathname.includes("\\") || pathname.includes("\0") || (file !== root && !file.startsWith(root + sep))) {
        response.writeHead(404).end("Not found"); return;
      }
      let info = await stat(file).catch(() => null);
      if (info?.isDirectory()) {
        if (!pathname.endsWith("/")) {
          response.writeHead(308, { Location: url.pathname + "/" + url.search }).end(); return;
        }
        file = resolve(file, "index.html");
        info = await stat(file).catch(() => null);
      }
      if (info?.isFile() && pathname.endsWith("/index.html")) {
        response.writeHead(308, { Location: url.pathname.slice(0, -10) + url.search }).end(); return;
      }
      let status = 200;
      if (!info?.isFile()) {
        status = 404;
        // GitHub Pages uses a single root 404.html for all missing paths.
        file = resolve(root, "404.html");
      }
      const body = await readFile(file);
      response.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Content-Length": body.length, "Cache-Control": "no-cache" });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch {
      response.writeHead(500, { "Content-Type": "text/plain" }).end("Build unavailable. Run npm run build first.");
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const index = process.argv.indexOf("--port");
  const port = index >= 0 ? Number(process.argv[index + 1]) : 4173;
  const server = createPreviewServer();
  server.listen(port, "127.0.0.1", () => console.log(`Static preview: http://127.0.0.1:${server.address().port}`));
}
