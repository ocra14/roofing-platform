import Image from "next/image";
import { ROOF_IMAGES } from "@/lib/images";

type ImgProps = {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fallback image key when no src is provided — maps to a real roofing photo. */
  fallbackLabel?: string;
  fallbackTone?: "slate" | "blue" | "amber" | "stone";
};

/** Map fallback labels to real roofing images. */
function fallbackImage(label: string, tone: string): string {
  const key = label.toLowerCase();
  if (key.includes("repair") || key.includes("leak")) return ROOF_IMAGES.services.repair;
  if (key.includes("replacement")) return ROOF_IMAGES.services.replacement;
  if (key.includes("inspection")) return ROOF_IMAGES.services.inspection;
  if (key.includes("storm")) return ROOF_IMAGES.services.storm;
  if (key.includes("emergency")) return ROOF_IMAGES.services.emergency;
  if (key.includes("commercial") || key.includes("flat")) return ROOF_IMAGES.services.commercial;
  if (key.includes("maintenance")) return ROOF_IMAGES.services.maintenance;
  if (key.includes("gutter")) return ROOF_IMAGES.services.gutters;
  if (key.includes("metal")) return ROOF_IMAGES.projects[2];
  if (key.includes("tile")) return ROOF_IMAGES.projects[3];
  if (key.includes("blog") || key.includes("article") || key.includes("guide")) return ROOF_IMAGES.blog[0];
  if (key.includes("before")) return ROOF_IMAGES.beforeAfter.before;
  if (key.includes("after")) return ROOF_IMAGES.beforeAfter.after;
  // Tone-based fallback
  if (tone === "stone") return ROOF_IMAGES.projects[5];
  if (tone === "blue") return ROOF_IMAGES.projects[1];
  if (tone === "amber") return ROOF_IMAGES.projects[0];
  return ROOF_IMAGES.projects[0];
}

/**
 * Image renderer.
 * - http(s) and local /uploads paths go through next/image (optimized, lazy).
 * - data: URLs (placeholders, uploaded-but-unprocessed) render as plain <img>
 *   because the optimizer cannot fetch inline data safely at build time.
 */
export function Img({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  fallbackLabel = "Image",
  fallbackTone = "slate",
}: ImgProps) {
  const source =
    src && src.trim() ? src : fallbackImage(fallbackLabel, fallbackTone);

  if (source.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={source}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={source}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
