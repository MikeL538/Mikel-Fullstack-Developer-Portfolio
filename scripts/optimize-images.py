"""Regenerate committed WebP variants and dimensions: python scripts/optimize-images.py.

Requires Pillow with WebP support. Originals are never modified. Normal npm builds
consume committed outputs and do not require Python or an image encoder.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "images/optimized"
OUT.mkdir(parents=True, exist_ok=True)
profile = json.loads((ROOT / "src/config/profile.json").read_text(encoding="utf-8"))
projects = json.loads((ROOT / "src/assets/projects.json").read_text(encoding="utf-8"))
recipes = {
    profile["images"]["hero"]: [320, 626],
    profile["images"]["portrait"]: [256, 512],
    profile["images"]["header"]: [107],
    "images/Background.png": [768, 1536],
}
for project in projects:
    recipes[project["image"]] = [480, 960]
    recipes.setdefault(project["imageLarge"], [])

manifest = {}
for source, widths in recipes.items():
    source_path = PUBLIC / source
    with Image.open(source_path) as original:
        original = ImageOps.exif_transpose(original)
        entry = {
            "width": original.width, "height": original.height,
            "sha256": hashlib.sha256(source_path.read_bytes()).hexdigest(),
            "variants": [],
        }
        for width in sorted({min(width, original.width) for width in widths}):
            height = round(original.height * width / original.width)
            resized = original.resize((width, height), Image.Resampling.LANCZOS)
            name = source.removeprefix("images/").rsplit(".", 1)[0].replace("/", "-")
            target = OUT / f"{name}-{width}.webp"
            resized.save(target, "WEBP", quality=88, method=6, exact=True)
            # Existing WebP screenshots may already be more compact. Keep them
            # instead of shipping a larger recompression at a smaller resolution.
            if source_path.suffix == ".webp" and target.stat().st_size >= source_path.stat().st_size:
                target.unlink()
                entry["variants"].append({"src": source, "width": original.width, "height": original.height})
                break
            entry["variants"].append({"src": target.relative_to(PUBLIC).as_posix(), "width": width, "height": height})
        manifest[source] = entry

(ROOT / "src/assets/image-manifest.json").write_text(
    json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
)
print(f"Prepared dimensions for {len(manifest)} sources; {sum(len(x['variants']) for x in manifest.values())} WebP variants.")
