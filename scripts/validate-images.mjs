import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

export function dimensions(bytes) {
  if (bytes.toString("ascii", 1, 4) === "PNG") return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  if (bytes.toString("ascii", 8, 12) === "WEBP") {
    const type = bytes.toString("ascii", 12, 16);
    if (type === "VP8X") return [1 + bytes.readUIntLE(24, 3), 1 + bytes.readUIntLE(27, 3)];
    if (type === "VP8 ") return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    if (type === "VP8L") {
      const bits = bytes.readUInt32LE(21);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
  }
  throw new Error("Unsupported image format; expected PNG or WebP");
}

export function validateImages() {
  const manifest = json("src/assets/image-manifest.json");
  const projects = json("src/assets/projects.json");
  const profile = json("src/config/profile.json");
  const required = new Set([...Object.values(profile.images), "images/Background.png",
    ...projects.flatMap((project) => [project.image, project.imageLarge])]);
  const errors = [];
  const read = (src) => {
    if (!/^images\/[\w./-]+$/.test(src) || src.split("/").includes("..")) throw new Error(`Invalid path: ${src}`);
    return readFileSync(resolve(root, "public", src));
  };
  for (const src of required) {
    try {
      const entry = manifest[src];
      if (!entry) throw new Error("Missing dimensions; run npm run images:generate");
      const bytes = read(src);
      if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256) throw new Error("Source changed; run npm run images:generate");
      const check = (data, info) => {
        const [width, height] = dimensions(data);
        if (width !== info.width || height !== info.height) throw new Error(`Incorrect dimensions: ${info.src ?? src}`);
      };
      check(bytes, entry);
      let previousWidth = 0;
      for (const variant of entry.variants) {
        check(read(variant.src), variant);
        if (variant.width <= previousWidth || variant.width > entry.width) throw new Error("Variants must have unique, increasing widths without upscaling");
        previousWidth = variant.width;
      }
    } catch (error) { errors.push(`${src}: ${error.message}`); }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = validateImages();
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log("Image sources, dimensions and responsive variants valid.");
}
