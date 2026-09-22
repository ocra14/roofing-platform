import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: siteUrl("sitemap.xml"),
    host: siteUrl(),
  };
}
