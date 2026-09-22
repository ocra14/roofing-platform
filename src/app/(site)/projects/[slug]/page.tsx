import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { BeforeAfter } from "@/components/site/before-after";
import { ProjectsGrid } from "@/components/site/project-card";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { formatDate, placeholder } from "@/lib/utils";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { isEnabled: true }, select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return buildMetadata({
    path: `/projects/${project.slug}/`,
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.description || undefined,
    noindex: !project.isIndexed,
  });
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      service: { select: { name: true, slug: true } },
      location: { select: { city: true, state: true, slug: true } },
      featuredImage: { select: { url: true } },
      beforeImage: { select: { url: true } },
      afterImage: { select: { url: true } },
      images: { include: { media: { select: { url: true } } }, orderBy: { order: "asc" } },
    },
  });

  if (!project || !project.isEnabled) notFound();

  const related = await prisma.project.findMany({
    where: {
      isEnabled: true,
      id: { not: project.id },
      OR: [{ serviceId: project.serviceId }, { locationId: project.locationId }],
    },
    take: 3,
    orderBy: [{ projectDate: "desc" }],
    include: {
      service: { select: { name: true } },
      location: { select: { city: true, state: true } },
      featuredImage: { select: { url: true } },
    },
  });

  const hasBeforeAfter = !!(project.beforeImage?.url && project.afterImage?.url);
  const galleryImages = project.images.map((i) => i.media.url);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects/" },
    ...(project.service ? [{ name: project.service.name, url: `/${project.service.slug}/` }] : []),
    { name: project.title, url: `/projects/${project.slug}/` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />

      <PageHero
        title={project.title}
        eyebrow={project.service?.name || "Project"}
        description={project.description}
        crumbs={crumbs}
        image={project.featuredImage?.url ?? null}
        fallbackLabel={project.service?.name || "Roofing project"}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hasBeforeAfter ? (
              <>
                <h2 className="text-xl">Before &amp; After</h2>
                <div className="mt-5">
                  <BeforeAfter
                    beforeSrc={project.beforeImage!.url}
                    afterSrc={project.afterImage!.url}
                    alt={project.title}
                  />
                </div>
              </>
            ) : null}

            {project.description ? (
              <div className="prose-roofing mt-10">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : null}

            {project.testimonial ? (
              <figure className="mt-10 rounded-xl border border-line bg-surface p-7">
                <Stars rating={5} size={16} />
                <blockquote className="mt-4 text-lg leading-relaxed text-ink/90">
                  “{project.testimonial}”
                </blockquote>
              </figure>
            ) : null}

            {galleryImages.length ? (
              <div className="mt-10">
                <h2 className="text-xl">Project Gallery</h2>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {galleryImages.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-line bg-canvas"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${project.title} - photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside>
            <div className="card p-6">
              <h3 className="text-base">Project Details</h3>
              <dl className="mt-5 space-y-4">
                {project.location ? (
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Location</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{project.location.city}, {project.location.state}</dd>
                  </div>
                ) : null}
                {project.roofType ? (
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Roof Type</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{project.roofType}</dd>
                  </div>
                ) : null}
                {project.projectSize ? (
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Size</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{project.projectSize}</dd>
                  </div>
                ) : null}
                {project.materialsUsed ? (
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Materials</dt>
                    <dd className="max-w-[60%] text-right text-sm font-semibold text-ink">{project.materialsUsed}</dd>
                  </div>
                ) : null}
                {project.projectDate ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted">Completed</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{formatDate(project.projectDate)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-6 border-t border-line pt-6">
                <a href="/free-estimate/" className="btn btn-primary btn-block">
                  <Icon name="send" size={16} />
                  Request a Similar Quote
                </a>
                {project.service ? (
                  <a href={`/${project.service.slug}/`} className="btn btn-outline btn-block mt-3">
                    About {project.service.name}
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">More Work</span>
              <h2 className="mt-3">Related Projects</h2>
            </div>
            <ProjectsGrid projects={related} />
          </div>
        </section>
      ) : null}

      <CtaSection />
    </>
  );
}
