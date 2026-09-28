import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { Icon, type IconName } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { TrustBar } from "@/components/site/trust-bar";
import { ProcessSteps } from "@/components/site/process-steps";
import { ProjectsGrid } from "@/components/site/project-card";
import { BeforeAfter } from "@/components/site/before-after";
import { ReviewsGrid } from "@/components/site/review-card";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { ServiceAreasSection } from "@/components/site/service-areas-section";
import { CtaSection } from "@/components/site/cta-section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ContentPage } from "@/components/site/content-page";
import { buildMetadata, breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";
import { asJsonArray, placeholder } from "@/lib/utils";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const [services, pages] = await Promise.all([
    prisma.service.findMany({ where: { isEnabled: true }, select: { slug: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
  ]);
  return [...services.map((s) => ({ slug: s.slug })), ...pages.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [service, page] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    prisma.page.findUnique({ where: { slug }, select: { title: true, excerpt: true, isIndexed: true } }),
  ]);
  if (service) {
    return buildMetadata({
      path: `/${service.slug}/`,
      title: service.seoTitle || `${service.name} - Professional Roofing`,
      description: service.seoDescription || service.excerpt || undefined,
      noindex: !service.isIndexed,
    });
  }
  if (page) {
    return buildMetadata({
      path: `/${slug}/`,
      title: page.title,
      description: page.excerpt || undefined,
      noindex: !page.isIndexed,
    });
  }
  return {};
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { heroImage: { select: { url: true } }, ogImage: { select: { url: true } } },
  });

  if (!service || !service.isEnabled) {
    // Not a service: fall back to a CMS-managed content/legal page.
    const page = await prisma.page.findUnique({ where: { slug } });
    if (page && page.status === "PUBLISHED") return <ContentPage page={page} />;
    notFound();
  }

  const isMaterial = service.kind === "MATERIAL";

  const [projects, reviews, faqs, relatedServices] = await Promise.all([
    prisma.project.findMany({
      where: { serviceId: service.id, isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { projectDate: "desc" }],
      take: 6,
      include: {
        service: { select: { name: true } },
        location: { select: { city: true, state: true } },
        featuredImage: { select: { url: true } },
        beforeImage: { select: { url: true } },
        afterImage: { select: { url: true } },
      },
    }),
    prisma.review.findMany({
      where: { serviceId: service.id, isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { reviewedAt: "desc" }],
      take: 6,
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
    prisma.faq.findMany({
      where: { serviceId: service.id, isEnabled: true },
      orderBy: [{ order: "asc" }],
      take: 6,
      select: { id: true, question: true, answer: true },
    }),
    prisma.service.findMany({
      where: { kind: service.kind, isEnabled: true, id: { not: service.id } },
      orderBy: [{ order: "asc" }],
      take: 5,
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const benefits = asJsonArray<string>(service.benefits);
  const processSteps = asJsonArray<{ title: string; description: string }>(service.process);
  const serviceFaqs = asJsonArray<{ question: string; answer: string }>(service.faqs);
  const allFaqs = [...faqs, ...serviceFaqs.map((f, i) => ({ id: `inline-${i}`, ...f }))];

  const beforeAfter = projects.find((p) => p.isBeforeAfter && p.beforeImage && p.afterImage);

  const jsonLd: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: isMaterial ? "Materials" : "Roofing Services", url: "/roofing-services/" },
      { name: service.name, url: `/${service.slug}/` },
    ]),
    await serviceJsonLd(service),
  ];
  if (allFaqs.length) jsonLd.push(faqPageJsonLd(allFaqs));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={service.name}
        eyebrow={isMaterial ? "Roofing Material" : "Roofing Service"}
        description={service.excerpt || service.description}
        crumbs={[
          { name: "Home", url: "/" },
          { name: isMaterial ? "Roofing Services" : "Roofing Services", url: "/roofing-services/" },
          { name: service.name },
        ]}
        image={service.heroImage?.url ?? null}
        fallbackLabel={service.name}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/free-estimate/" className="btn btn-accent">
            <Icon name="send" size={16} />
            {service.ctaLabel || "Get a Free Estimate"}
          </a>
        </div>
      </PageHero>

      <TrustBar />

      {/* Overview */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isMaterial ? (
              <span className="eyebrow">Material Overview</span>
            ) : (
              <span className="eyebrow">Service Overview</span>
            )}
            <h2 className="mt-3">
              {isMaterial ? `About ${service.name}` : `Professional ${service.name}`}
            </h2>
            {service.description ? (
              <div className="prose-roofing mt-6 text-base text-muted">
                {service.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            {benefits.length ? (
              <div className="card p-6">
                <h3 className="text-base">Key Benefits</h3>
                <ul className="mt-4 space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink/85">
                      <Icon name="check" size={17} className="mt-0.5 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.warranty ? (
              <div className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Icon name="shield" size={19} />
                </span>
                <h3 className="mt-3.5 text-sm">Warranty</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.warranty}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Benefits (full width band) */}
      {benefits.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Why It Matters</span>
              <h2 className="mt-3">Benefits of {service.name}</h2>
            </div>
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                    <Icon name="check" size={19} />
                  </span>
                  <p className="text-sm leading-relaxed text-ink/85 pt-1.5">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Process */}
      {processSteps.length ? (
        <ProcessSteps
          steps={processSteps}
          title={`Our ${service.name} Process`}
          description="A clear, step-by-step path from your first call to the final walkthrough."
        />
      ) : (
        <ProcessSteps />
      )}

      {/* Before / After */}
      {beforeAfter ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Before &amp; After</span>
              <h2 className="mt-3">A Recent {service.name} Transformation</h2>
            </div>
            <BeforeAfter
              beforeSrc={beforeAfter.beforeImage!.url}
              afterSrc={beforeAfter.afterImage!.url}
              alt={beforeAfter.title}
            />
          </div>
        </section>
      ) : null}

      {/* Related projects */}
      {projects.length ? (
        <section className="section">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Recent Work</span>
              <h2 className="mt-3">{service.name} Projects</h2>
              <p className="lead mt-4">See how we've applied this service on real homes and businesses.</p>
            </div>
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      {reviews.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Customer Feedback</span>
              <h2 className="mt-3">What Customers Say About Our {service.name}</h2>
            </div>
            <ReviewsGrid reviews={reviews} />
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {allFaqs.length ? (
        <section className="section bg-surface">
          <div className="container-page max-w-3xl">
            <div className="mb-10">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-3">{service.name} Questions</h2>
            </div>
            <FaqAccordion items={allFaqs} />
          </div>
        </section>
      ) : null}

      <ServiceAreasSection />

      {/* Related services */}
      {relatedServices.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-8">
              <span className="eyebrow">Related</span>
              <h2 className="mt-3">{isMaterial ? "Other Materials" : "Other Services"}</h2>
            </div>
            <ul className="flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <li key={s.id}>
                  <a href={`/${s.slug}/`} className="btn btn-outline">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaSection primaryLabel={service.ctaLabel || "Get a Free Estimate"} />
    </>
  );
}
