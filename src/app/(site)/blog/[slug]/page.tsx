import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

function renderMarkdown(markdown: string) {
  // Lightweight renderer for our seeded article format (## headings + paragraphs).
  // Avoids a heavy dependency; content is trusted admin-authored markdown.
  const blocks = markdown.split(/\n\n+/).filter(Boolean);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return <h2 key={i}>{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith("### ")) {
      return <h3 key={i}>{trimmed.slice(4)}</h3>;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split(/\n/).filter(Boolean);
      return (
        <ol key={i} className="list-decimal space-y-2 pl-5 text-muted marker:font-semibold marker:text-accent">
          {items.map((it, j) => (
            <li key={j}>{it.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      );
    }
    return <p key={i}>{trimmed}</p>;
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return buildMetadata({
    path: `/blog/${post.slug}/`,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    noindex: !post.isIndexed,
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      featuredImage: { select: { url: true } },
      services: { where: { isEnabled: true }, select: { name: true, slug: true } },
      locations: { where: { isEnabled: true }, select: { city: true, slug: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  const related = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", id: { not: post.id }, categoryId: post.categoryId },
    take: 3,
    orderBy: [{ publishedAt: "desc" }],
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
      featuredImage: { select: { url: true } },
    },
  });

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" },
    ...(post.category ? [{ name: post.category.name, url: `/blog/?category=${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}/` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />

      <PageHero
        title={post.title}
        eyebrow={post.category?.name || "Article"}
        description={post.excerpt}
        crumbs={crumbs}
        image={post.featuredImage?.url ?? null}
        fallbackLabel={post.category?.name || "Roofing article"}
      >
        <div className="mt-6 flex items-center gap-3 text-sm text-white/65">
          {post.author?.name ? <span>By {post.author.name}</span> : null}
          <span className="text-white/35">•</span>
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          <span className="text-white/35">•</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </PageHero>

      <article className="section">
        <div className="container-page max-w-3xl">
          <div className="prose-roofing">{renderMarkdown(post.content)}</div>

          {post.services.length || post.locations.length ? (
            <div className="mt-12 border-t border-line pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted">Related</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {post.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/${s.slug}/`} className="badge hover:border-primary hover:text-primary">
                      {s.name}
                    </Link>
                  </li>
                ))}
                {post.locations.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/service-areas/${l.slug}/`} className="badge hover:border-primary hover:text-primary">
                      {l.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Keep Reading</span>
              <h2 className="mt-3">Related Articles</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}/`} className="card card-hover group flex flex-col overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden bg-canvas" />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">
                      {r.category?.name}
                    </span>
                    <h3 className="mt-2 text-base leading-snug">{r.title}</h3>
                    {r.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted">{r.excerpt}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaSection />
    </>
  );
}
