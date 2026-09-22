import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { placeholder } from "@/lib/utils";
import { BeforeAfterClient } from "@/components/site/before-after-client";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/before-after/",
    title: "Before & After Roofing Projects",
    description:
      "See roof transformations with our before and after comparison slider - repairs, replacements, storm restoration, and commercial roofing.",
  })),
};

export default async function BeforeAfterPage() {
  const projects = await prisma.project.findMany({
    where: { isEnabled: true, isBeforeAfter: true },
    orderBy: [{ isFeatured: "desc" }, { projectDate: "desc" }],
    include: {
      beforeImage: { select: { url: true } },
      afterImage: { select: { url: true } },
      service: { select: { name: true, slug: true } },
      location: { select: { city: true, state: true } },
    },
  });

  return (
    <>
      <PageHero
        title="Before & After"
        eyebrow="Transformations"
        description="Drag the slider on any project to see the difference quality roofing makes - from storm-damaged shingles to a brand-new roof."
        crumbs={[{ name: "Home", url: "/" }, { name: "Before & After" }]}
      />

      <section className="section">
        <div className="container-page">
          {projects.length ? (
            <div className="space-y-12">
              {projects.map((p) => {
                const before = p.beforeImage?.url || placeholder("Before", 960, 600, "stone");
                const after = p.afterImage?.url || placeholder("After", 960, 600, "blue");
                return (
                  <div key={p.id} className="grid gap-8 lg:grid-cols-5 lg:items-center">
                    <div className="lg:col-span-3">
                      <BeforeAfterClient before={before} after={after} alt={p.title} />
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
                        {p.service ? <Link href={`/${p.service.slug}/`} className="hover:text-primary">{p.service.name}</Link> : null}
                        {p.service && p.location ? <span className="text-line">/</span> : null}
                        {p.location ? <span>{p.location.city}, {p.location.state}</span> : null}
                      </div>
                      <h2 className="mt-2.5 text-xl leading-snug">{p.title}</h2>
                      {p.description ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
                      ) : null}
                      <div className="mt-5">
                        <Link href={`/projects/${p.slug}/`} className="btn btn-outline btn-sm">
                          View Project Details
                          <Icon name="arrow-right" size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-surface p-12 text-center text-muted">
              No before &amp; after projects published yet.
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
