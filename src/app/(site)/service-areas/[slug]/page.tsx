import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { ProjectsGrid } from "@/components/site/project-card";
import { ReviewsGrid } from "@/components/site/review-card";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaSection } from "@/components/site/cta-section";
import { ServiceAreasSection } from "@/components/site/service-areas-section";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref, splitList } from "@/lib/utils";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const locations = await prisma.location.findMany({ where: { isEnabled: true }, select: { slug: true } });
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const location = await prisma.location.findUnique({ where: { slug } });
  if (!location) return {};
  return buildMetadata({
    path: `/service-areas/${location.slug}/`,
    title: location.seoTitle || `Roofing in ${location.city}, ${location.state}`,
    description:
      location.seoDescription ||
      `Professional roofing services in ${location.city}, ${location.state} - repairs, replacement, storm damage, and inspections. ${location.excerpt || ""}`.trim(),
    noindex: !location.isIndexed,
  });
}

export default async function LocationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [location, company] = await Promise.all([
    prisma.location.findUnique({
      where: { slug },
      include: {
        heroImage: { select: { url: true } },
        services: { where: { isEnabled: true, kind: "SERVICE" }, orderBy: [{ order: "asc" }], select: { id: true, name: true, slug: true, excerpt: true } },
      },
    }),
    getCompanySettings(),
  ]);

  if (!location || !location.isEnabled) notFound();

  const [projects, reviews, faqs] = await Promise.all([
    prisma.project.findMany({
      where: { locationId: location.id, isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { projectDate: "desc" }],
      take: 6,
      include: {
        service: { select: { name: true } },
        location: { select: { city: true, state: true } },
        featuredImage: { select: { url: true } },
      },
    }),
    prisma.review.findMany({
      where: { locationId: location.id, isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { reviewedAt: "desc" }],
      take: 6,
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
    prisma.faq.findMany({
      where: { locationId: location.id, isEnabled: true },
      orderBy: [{ order: "asc" }],
      take: 6,
      select: { id: true, question: true, answer: true },
    }),
  ]);

  const zipCodes = splitList(location.zipCodes);
  const mapQuery = encodeURIComponent(`${location.city}, ${location.state}`);
  const phone = location.phone || company.phone;

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Service Areas", url: "/service-areas/" },
    { name: `${location.city}, ${location.state}`, url: `/service-areas/${location.slug}/` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />

      <PageHero
        title={`Roofing in ${location.city}, ${location.state}`}
        eyebrow={`${location.city} Roofing`}
        description={location.excerpt || location.description}
        crumbs={crumbs}
        image={location.heroImage?.url ?? null}
        fallbackLabel={`${location.city} roofing`}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/free-estimate/" className="btn btn-accent">
            <Icon name="send" size={16} />
            Free {location.city} Roof Inspection
          </a>
          {phone ? (
            <a href={telHref(phone)} className="btn btn-ghost-light">
              <Icon name="phone" size={16} />
              Call {formatPhone(phone)}
            </a>
          ) : null}
        </div>
      </PageHero>

      {/* Local overview + map */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Local Roofing in {location.city}</span>
            <h2 className="mt-3">Your {location.city} Roofing Team</h2>
            {location.description ? (
              <div className="prose-roofing mt-6">
                {location.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : null}

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {location.addressLine1 ? (
                <div className="flex items-start gap-3">
                  <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Local Office</dt>
                    <dd className="mt-0.5 text-sm text-ink">{location.addressLine1}</dd>
                  </div>
                </div>
              ) : null}
              {phone ? (
                <div className="flex items-start gap-3">
                  <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Phone</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{formatPhone(phone)}</dd>
                  </div>
                </div>
              ) : null}
              {location.businessHours ? (
                <div className="flex items-start gap-3">
                  <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Hours</dt>
                    <dd className="mt-0.5 whitespace-pre-line text-sm text-ink">{location.businessHours}</dd>
                  </div>
                </div>
              ) : null}
              {zipCodes.length ? (
                <div className="flex items-start gap-3">
                  <Icon name="grid" size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">ZIP Codes Served</dt>
                    <dd className="mt-0.5 text-sm text-ink">{zipCodes.join(", ")}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="overflow-hidden rounded-xl border border-line">
            <iframe
              title={`Map of ${location.city}, ${location.state}`}
              src={location.mapEmbedUrl || `https://maps.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: "block", minHeight: "360px" }}
            />
          </div>
        </div>
      </section>

      {/* Services available here */}
      {location.services.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Roofing Services in {location.city}</span>
              <h2 className="mt-3">What We Offer Locally</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {location.services.map((s) => (
                <a key={s.id} href={`/${s.slug}/`} className="card card-hover group p-6">
                  <h3 className="text-base">{s.name}</h3>
                  {s.excerpt ? <p className="mt-2 text-sm text-muted line-clamp-2">{s.excerpt}</p> : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                    Learn more
                    <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section className="section">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Recent Work</span>
              <h2 className="mt-3">Roofing Projects in {location.city}</h2>
            </div>
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      ) : null}

      {reviews.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Local Reviews</span>
              <h2 className="mt-3">What {location.city} Customers Say</h2>
            </div>
            <ReviewsGrid reviews={reviews} />
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="section">
          <div className="container-page max-w-3xl">
            <div className="mb-10">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-3">{location.city} Roofing FAQ</h2>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      ) : null}

      <ServiceAreasSection />
      <CtaSection title={`Ready for Roofing Service in ${location.city}?`} />
    </>
  );
}
