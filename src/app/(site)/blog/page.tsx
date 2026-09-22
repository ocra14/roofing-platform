import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { BlogList } from "@/components/site/blog-list";
import { CtaSection } from "@/components/site/cta-section";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/blog/",
    title: "Roofing Blog & Resources",
    description:
      "Practical roofing guides on replacement cost, repairs, storm damage, insurance, and choosing materials - written for homeowners.",
  })),
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
      featuredImage: { select: { url: true } },
    },
  });

  const categories = await prisma.blogCategory.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHero
        title="Roofing Guides & Resources"
        eyebrow="Blog"
        description="Clear, practical information to help you make confident decisions about your roof - from repair vs. replacement to navigating insurance."
        crumbs={[{ name: "Home", url: "/" }, { name: "Blog" }]}
      />

      <section className="section">
        <div className="container-page">
          {categories.length ? (
            <div className="mb-10 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <a key={c.id} href={`/blog/?category=${c.slug}`} className="badge px-3.5 py-1.5 hover:border-primary hover:text-primary">
                  {c.name}
                </a>
              ))}
            </div>
          ) : null}

          <BlogList posts={posts} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
