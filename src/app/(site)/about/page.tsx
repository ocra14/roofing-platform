import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { Certifications } from "@/components/site/certifications";
import { CtaSection } from "@/components/site/cta-section";
import { ServiceAreasSection } from "@/components/site/service-areas-section";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/about/",
    title: "About Our Roofing Company",
    description:
      "Learn about our roofing company, our team, our values, and our commitment to quality workmanship and honest service.",
  })),
};

export default async function AboutPage() {
  const [company, team] = await Promise.all([
    getCompanySettings(),
    prisma.teamMember.findMany({
      where: { isEnabled: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);

  const values = [
    { icon: "shield" as const, title: "Honesty First", description: "If your roof doesn't need work, we tell you. If it does, we show you the photos and explain the options." },
    { icon: "badge" as const, title: "Quality Workmanship", description: "Manufacturer-trained crews, proper flashing, and attention to the details that prevent future leaks." },
    { icon: "user" as const, title: "Respect for Your Home", description: "Property protection, daily cleanup, and a magnetic nail sweep before we call the job done." },
    { icon: "clock" as const, title: "Stand Behind Our Work", description: "A written workmanship warranty and responsive after-sales support on every project." },
  ];

  return (
    <>
      <PageHero
        title={`About ${company.name}`}
        eyebrow="Our Company"
        description={company.description || company.tagline}
        crumbs={[{ name: "Home", url: "/" }, { name: "About" }]}
      />

      <Certifications />

      {/* Story + mission */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-3">Built on Craft and Trust</h2>
            <div className="prose-roofing mt-6">
              <p>
                {company.name} was founded with one goal: to give homeowners a roofing contractor
                they can trust completely. That means honest assessments, transparent pricing, and
                workmanship that lasts.
              </p>
              <p>
                {company.yearsInBusiness > 0
                  ? `For more than ${company.yearsInBusiness} years we've served the ${company.city || "local"} community, completing ${company.roofsCompleted.toLocaleString()}+ roofing projects - from small repairs to full commercial re-roofs.`
                  : "We've served the local community with roofing projects from small repairs to full commercial re-roofs."}
              </p>
              <p>
                We are locally based and locally invested. Our crews live here, our reputation is
                built here, and every project is an opportunity to earn a neighbor's referral.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon name={v.icon} size={20} />
                </span>
                <h3 className="mt-4 text-base">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length ? (
        <section className="section bg-surface">
          <div className="container-page">
            <div className="mb-12 max-w-2xl">
              <span className="eyebrow">Our Team</span>
              <h2 className="mt-3">The People Behind Your Roof</h2>
              <p className="lead mt-4">
                Experienced professionals who take pride in their craft and treat your home with
                respect.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="card p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <h3 className="mt-4 text-base">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-secondary">{member.position}</p>
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
                  ) : null}
                  {member.certifications ? (
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                      {member.certifications}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ServiceAreasSection />
      <CtaSection />
    </>
  );
}
