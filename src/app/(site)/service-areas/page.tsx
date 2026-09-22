import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/service-areas/",
    title: "Service Areas",
    description:
      "Find roofing services in your city. Local crews, fast response, and city-specific roofing information and recent projects.",
  })),
};

export default async function ServiceAreasPage() {
  const [locations, company] = await Promise.all([
    prisma.location.findMany({
      where: { isEnabled: true },
      orderBy: [{ order: "asc" }, { city: "asc" }],
      include: {
        _count: { select: { projects: { where: { isEnabled: true } } } },
        services: { where: { isEnabled: true }, select: { name: true }, take: 4 },
      },
    }),
    getCompanySettings(),
  ]);

  return (
    <>
      <PageHero
        title="Roofing Service Areas"
        eyebrow="Service Areas"
        description={company.serviceAreaNote || "Locally based crews serving homeowners and businesses across the region."}
        crumbs={[{ name: "Home", url: "/" }, { name: "Service Areas" }]}
      />

      <section className="section">
        <div className="container-page">
          {locations.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((l) => (
                <a key={l.id} href={`/service-areas/${l.slug}/`} className="card card-hover group flex flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2.5">
                      <Icon name="map-pin" size={19} className="text-accent" />
                      <span className="font-display text-lg font-bold text-primary">
                        {l.city}, {l.state}
                      </span>
                    </span>
                    {l._count.projects > 0 ? (
                      <span className="badge">{l._count.projects} projects</span>
                    ) : null}
                  </div>
                  {l.excerpt ? (
                    <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted">{l.excerpt}</p>
                  ) : null}
                  {l.services.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {l.services.map((s) => (
                        <span key={s.name} className="badge">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                    View {l.city} roofing
                    <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-surface p-12 text-center text-muted">
              No service areas have been added yet.
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
