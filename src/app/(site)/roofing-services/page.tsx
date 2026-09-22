import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { Icon, type IconName } from "@/components/ui/icon";
import { ProcessSteps } from "@/components/site/process-steps";
import { CtaSection } from "@/components/site/cta-section";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/roofing-services/",
    title: "Roofing Services",
    description:
      "Complete residential and commercial roofing services: roof repair, replacement, inspection, storm damage restoration, emergency roofing, gutters, and maintenance.",
  })),
};

export default async function ServicesPage() {
  const [services, materials] = await Promise.all([
    prisma.service.findMany({
      where: { kind: "SERVICE", isEnabled: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, excerpt: true, description: true, icon: true },
    }),
    prisma.service.findMany({
      where: { kind: "MATERIAL", isEnabled: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, excerpt: true, icon: true },
    }),
  ]);

  return (
    <>
      <PageHero
        title="Professional Roofing Services"
        eyebrow="Our Services"
        description="Whether you need a small repair or a complete commercial re-roof, our trained crews deliver quality workmanship with transparent pricing and written warranties."
        crumbs={[{ name: "Home", url: "/" }, { name: "Roofing Services" }]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <a key={s.id} href={`/${s.slug}/`} className="card card-hover group flex gap-5 p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon name={(s.icon as IconName) || "home"} size={22} />
                </span>
                <div>
                  <h2 className="text-lg">{s.name}</h2>
                  {s.excerpt ? <p className="mt-2 text-sm leading-relaxed text-muted">{s.excerpt}</p> : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                    Learn more
                    <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {materials.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow">Roofing Materials</span>
              <h2 className="mt-3">Materials We Install</h2>
              <p className="lead mt-4">
                Compare the materials we work with - lifespan, maintenance, and ideal use - before
                you decide.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {materials.map((m) => (
                <a key={m.id} href={`/${m.slug}/`} className="card card-hover group p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={(m.icon as IconName) || "layer"} size={20} />
                  </span>
                  <h3 className="mt-4 text-base">{m.name}</h3>
                  {m.excerpt ? <p className="mt-2 text-sm text-muted line-clamp-2">{m.excerpt}</p> : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ProcessSteps />
      <CtaSection />
    </>
  );
}
