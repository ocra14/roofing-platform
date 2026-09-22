import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { ProjectsGrid } from "@/components/site/project-card";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { FilterSelect } from "@/components/site/filter-select";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/projects/",
    title: "Roofing Projects Portfolio",
    description:
      "Browse our completed roofing projects - repairs, replacements, storm restoration, commercial roofing, gutters - with before and after photos.",
  })),
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const single = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const serviceFilter = single(sp.service) || "";
  const cityFilter = single(sp.city) || "";
  const roofTypeFilter = single(sp.roofType) || "";

  const [projects, services, locations, roofTypes] = await Promise.all([
    prisma.project.findMany({
      where: {
        isEnabled: true,
        ...(serviceFilter ? { service: { slug: serviceFilter } } : {}),
        ...(cityFilter ? { location: { slug: cityFilter } } : {}),
        ...(roofTypeFilter ? { roofType: roofTypeFilter } : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { projectDate: "desc" }],
      include: {
        service: { select: { name: true } },
        location: { select: { city: true, state: true } },
        featuredImage: { select: { url: true } },
      },
    }),
    prisma.service.findMany({ where: { isEnabled: true }, orderBy: { name: "asc" }, select: { name: true, slug: true } }),
    prisma.location.findMany({ where: { isEnabled: true }, orderBy: { city: "asc" }, select: { city: true, slug: true } }),
    prisma.project.findMany({ where: { isEnabled: true, roofType: { not: null } }, distinct: ["roofType"], select: { roofType: true } }),
  ]);

  const activeFilters = [serviceFilter, cityFilter, roofTypeFilter].filter(Boolean);

  function filterHref(key: string, value: string) {
    const params = new URLSearchParams();
    if (serviceFilter && key !== "service") params.set("service", serviceFilter);
    if (cityFilter && key !== "city") params.set("city", cityFilter);
    if (roofTypeFilter && key !== "roofType") params.set("roofType", roofTypeFilter);
    params.set(key, value);
    return `/projects/?${params.toString()}`;
  }

  return (
    <>
      <PageHero
        title="Our Roofing Projects"
        eyebrow="Portfolio"
        description="Real projects completed by our crews - with details on materials, scope, and results. Filter by service, location, or roof type."
        crumbs={[{ name: "Home", url: "/" }, { name: "Projects" }]}
      />

      <section className="section">
        <div className="container-page">
          {/* Filters */}
          <div className="mb-8 rounded-xl border border-line bg-surface p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
              <div className="flex-1">
                <label htmlFor="filter-service" className="field-label">Service</label>
                <FilterSelect
                  id="filter-service"
                  param="service"
                  placeholder="All services"
                  value={serviceFilter}
                  options={services.map((s) => ({ value: s.slug, label: s.name }))}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="filter-city" className="field-label">City</label>
                <FilterSelect
                  id="filter-city"
                  param="city"
                  placeholder="All cities"
                  value={cityFilter}
                  options={locations.map((l) => ({ value: l.slug, label: l.city }))}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="filter-roof" className="field-label">Roof Type</label>
                <FilterSelect
                  id="filter-roof"
                  param="roofType"
                  placeholder="All roof types"
                  value={roofTypeFilter}
                  options={roofTypes.map((r) => ({ value: r.roofType as string, label: r.roofType as string }))}
                />
              </div>
              <a href="/projects/" className="btn btn-outline">
                <Icon name="close" size={15} />
                Clear
              </a>
            </div>
            {activeFilters.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-wide text-muted">Filtered by:</span>
                {serviceFilter ? (
                  <a href={filterHref("service", "")} className="badge hover:border-primary">
                    {services.find((s) => s.slug === serviceFilter)?.name} <Icon name="close" size={12} />
                  </a>
                ) : null}
                {cityFilter ? (
                  <a href={filterHref("city", "")} className="badge hover:border-primary">
                    {locations.find((l) => l.slug === cityFilter)?.city} <Icon name="close" size={12} />
                  </a>
                ) : null}
                {roofTypeFilter ? (
                  <a href={filterHref("roofType", "")} className="badge hover:border-primary">
                    {roofTypeFilter} <Icon name="close" size={12} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <p className="mb-6 text-sm text-muted">
            Showing <span className="font-semibold text-ink">{projects.length}</span>{" "}
            project{projects.length === 1 ? "" : "s"}
          </p>

          <ProjectsGrid projects={projects} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
