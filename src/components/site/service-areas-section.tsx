import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/ui/icon";

export async function ServiceAreasSection({ limit = 12 }: { limit?: number }) {
  const locations = await prisma.location.findMany({
    where: { isEnabled: true },
    orderBy: [{ order: "asc" }, { city: "asc" }],
    take: limit,
    select: { id: true, city: true, state: true, slug: true, excerpt: true, zipCodes: true },
  });

  if (!locations.length) return null;

  return (
    <section className="section" id="service-areas">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Service Areas</span>
          <h2 className="mt-3">Roofing Across the Metroplex</h2>
          <p className="lead mt-4">
            Locally based crews serving homeowners and businesses throughout the region. Select your
            city for local information and recent projects.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <Link
              key={l.id}
              href={`/service-areas/${l.slug}/`}
              className="card card-hover group flex items-center justify-between gap-4 p-5"
            >
              <span>
                <span className="flex items-center gap-2 text-base font-semibold text-ink">
                  <Icon name="map-pin" size={17} className="text-accent" />
                  {l.city}, {l.state}
                </span>
                {l.excerpt ? (
                  <span className="mt-1.5 block text-sm text-muted line-clamp-1">{l.excerpt}</span>
                ) : null}
              </span>
              <Icon
                name="arrow-right"
                size={17}
                className="shrink-0 text-secondary transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/service-areas/" className="btn btn-outline">
            View All Service Areas
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
