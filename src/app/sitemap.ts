import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, locations, projects, posts, pages] = await Promise.all([
    prisma.service.findMany({ where: { isEnabled: true, isIndexed: true }, select: { slug: true, updatedAt: true } }),
    prisma.location.findMany({ where: { isEnabled: true, isIndexed: true }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { isEnabled: true, isIndexed: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED", isIndexed: true }, select: { slug: true, publishedAt: true, updatedAt: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = [
    "",
    "roofing-services/",
    "projects/",
    "before-after/",
    "service-areas/",
    "reviews/",
    "financing/",
    "about/",
    "faq/",
    "blog/",
    "contact/",
    "free-estimate/",
  ];

  const now = new Date();

  return [
    ...staticPages.map((path) => ({
      url: siteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...services.map((s) => ({
      url: siteUrl(`${s.slug}/`),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...locations.map((l) => ({
      url: siteUrl(`service-areas/${l.slug}/`),
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: siteUrl(`projects/${p.slug}/`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: siteUrl(`blog/${p.slug}/`),
      lastModified: p.publishedAt ?? p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...pages.map((p) => ({
      url: siteUrl(`${p.slug}/`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
