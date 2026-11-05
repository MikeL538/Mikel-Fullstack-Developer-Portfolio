import { readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { JSDOM } from "jsdom";

// File sizes, not browser timings: no simulated LCP, CLS or Lighthouse scores.
const report = { kind: "static asset inventory", assets: [], cssImages: [], routes: {} };
for (const name of await readdir("dist/assets")) {
  if (!/\.(js|css)$/.test(name)) continue;
  const data = await readFile(`dist/assets/${name}`);
  report.assets.push({ name, bytes: data.length, gzipBytes: gzipSync(data).length });
  if (name.endsWith(".css")) {
    for (const match of data.toString().matchAll(/url\(["']?(\/images\/[^\s)"']+)["']?\)/g)) {
      report.cssImages.push({ src: match[1], bytes: (await stat(`dist${match[1]}`)).size });
    }
  }
}
for (const route of ["/pl/", "/pl/projects/", "/pl/about/"]) {
  const html = await readFile(`dist${route}index.html`, "utf8");
  const dom = new JSDOM(html);
  const images = [];
  for (const img of dom.window.document.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    images.push({ src, bytes: (await stat(`dist${src}`)).size,
      loading: img.getAttribute("loading") ?? "eager",
      width: img.getAttribute("width"), height: img.getAttribute("height"),
      srcset: img.getAttribute("srcset"), sizes: img.getAttribute("sizes") });
  }
  report.routes[route] = { htmlBytes: Buffer.byteLength(html), images };
  dom.window.close();
}
const output = process.argv[2];
if (output) {
  await mkdir(new URL("../docs/measurements/", import.meta.url), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
}
console.log(JSON.stringify(report, null, 2));
