import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/financing/",
    title: "Roofing Financing Options",
    description:
      "Flexible payment plans for roof repair and replacement. Financing subject to credit approval by the lender - learn about your options.",
  })),
};

export default async function FinancingPage() {
  const options = await prisma.financingOption.findMany({
    where: { isEnabled: true },
    orderBy: [{ order: "asc" }],
  });

  const steps = [
    { title: "Get your estimate", description: "We inspect your roof and provide a written, itemized quote." },
    { title: "Apply with the lender", description: "We point you to the lender's application, which typically takes minutes." },
    { title: "Review your terms", description: "The lender provides your approved rate and payment schedule in writing." },
    { title: "Schedule the work", description: "Once you accept, we put your project on the calendar." },
  ];

  return (
    <>
      <PageHero
        title="Roofing Financing Options"
        eyebrow="Financing"
        description="A new roof is a significant investment. Payment plans make it possible to protect your home now and spread the cost over time."
        crumbs={[{ name: "Home", url: "/" }, { name: "Financing" }]}
      />

      <section className="section">
        <div className="container-page">
          {options.length ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {options.map((o) => (
                <div key={o.id} className="card p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon name="badge" size={22} />
                  </span>
                  <h2 className="mt-5 text-lg">{o.name}</h2>
                  {o.description ? (
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{o.description}</p>
                  ) : null}
                  {o.providerName ? (
                    <p className="mt-5 border-t border-line pt-4 text-xs font-bold uppercase tracking-wide text-muted">
                      Provider: {o.providerName}
                    </p>
                  ) : null}
                  {o.providerUrl ? (
                    <a href={o.providerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-5">
                      Apply Now
                      <Icon name="arrow-right" size={15} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-muted">
              Financing options are being updated. Please call us for current payment plans.
            </div>
          )}
        </div>
      </section>

      {/* How financing works */}
      <section className="section bg-surface">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-3">Applying Is Simple</h2>
          </div>
          <ol className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Honest disclosure */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-7">
            <div className="flex items-start gap-4">
              <Icon name="alert" size={22} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="text-sm leading-relaxed text-amber-900">
                <h2 className="text-base font-bold text-amber-900">Important Disclosure</h2>
                <p className="mt-2">
                  All financing is provided and approved by third-party lenders, not by this company.
                  Rates, terms, and approval decisions are determined solely by the lender based on
                  your credit profile. We do not guarantee approval or any specific rate, and we
                  receive no decision-making role in your application. Always review the lender's
                  terms carefully before signing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title="Ready to Get Started?"
        description="Get a free, written estimate first - then decide if financing makes sense for you."
      />
    </>
  );
}
