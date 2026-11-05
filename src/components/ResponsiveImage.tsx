import type { ImgHTMLAttributes } from "react";
import manifest from "../assets/image-manifest.json";
import { assetUrl } from "../utils/assetUrl";

type ImageInfo = { width: number; height: number; variants: { src: string; width: number }[] };
const images: Record<string, ImageInfo> = manifest;

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height"> & {
  source: string;
  alt: string;
  original?: boolean;
};

export default function ResponsiveImage({ source, alt, original = false, ...props }: Props) {
  const image = images[source];
  if (!image) throw new Error(`Missing image dimensions for ${source}. Run npm run images:generate.`);
  const variants = original ? [] : image.variants;
  return <img {...props} alt={alt}
    src={assetUrl(variants.at(-1)?.src ?? source)}
    srcSet={variants.length > 1 ? variants.map((variant) => `${assetUrl(variant.src)} ${variant.width}w`).join(", ") : undefined}
    width={image.width} height={image.height} />;
}
