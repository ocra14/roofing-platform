import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { DynamicForm } from "@/components/site/dynamic-form";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { formatPhone, telHref } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/free-estimate/",
    title: "Get a Free Roofing Estimate",
    description:
      "Request a free, no-obligation roof inspection and written estimate. Local roofing experts with transparent pricing and no pressure.",
  })),
};

export default async function FreeEstimatePage() {
  const [company, form] = await Promise.all([
    getCompanySettings(),
    prisma.form.findUnique({
      where: { slug: "free-estimate" },
      include: { fields: { where: { isEnabled: true }, orderBy: { order: "asc" } } },
    }),
  ]);

  return (
    <>
      <PageHero
        title="Get Your Free Roof Estimate"
        eyebrow="Free Estimate"
        description="Tell us about your roof and we'll provide a written inspection report and an honest, itemized estimate - with no obligation and no pressure."
        crumbs={[{ name: "Home", url: "/" }, { name: "Free Estimate" }]}
      >
        {company.phone ? (
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="text-sm text-white/70">Prefer to talk now?</span>
            <a
              href={telHref(company.phone)}
              className="inline-flex items-center gap-2 font-display text-xl font-bold text-white"
            >
              <Icon name="phone" size={20} className="text-accent" />
              {formatPhone(company.phone)}
            </a>
          </div>
        ) : null}
      </PageHero>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-7 md:p-9">
              <h2>Request Your Free Inspection</h2>
              <p className="mt-3 text-sm text-muted">
                Fill out the form and we'll call you to schedule a convenient time. Most requests
                are answered within one business day.
              </p>
              <div className="mt-7">
                {form && form.isEnabled ? (
                  <DynamicForm
                    formSlug={form.slug}
                    fields={form.fields}
                    submitLabel={form.submitLabel || "Get My Free Estimate"}
                    successMessage={form.successMessage}
                    redirectUrl={form.redirectUrl}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
                    The estimate form is currently unavailable. Please call us directly.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {company.googleRating > 0 ? (
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <Stars rating={company.googleRating} size={18} />
                  <span className="font-display text-2xl font-bold text-primary">
                    {company.googleRating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Rated by {company.reviewCount.toLocaleString()} customers across verified review
                  platforms.
                </p>
              </div>
            ) : null}

            <div className="card p-6">
              <h3 className="text-base">What to Expect</h3>
              <ul className="mt-4 space-y-3.5">
                {[
                  { icon: "calendar-check" as const, text: "We schedule a convenient inspection window" },
                  { icon: "search" as const, text: "A thorough inspection of your roof, flashing, and attic" },
                  { icon: "file" as const, text: "A written, itemized estimate with photos" },
                  { icon: "user" as const, text: "Time to ask questions - no pushy sales tactics" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-ink/85">
                    <Icon name={item.icon} size={18} className="mt-0.5 shrink-0 text-accent" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card bg-primary p-6 text-white">
              <Icon name="siren" size={22} className="text-accent" />
              <h3 className="mt-3 text-base text-white">Roofing Emergency?</h3>
              <p className="mt-2 text-sm text-white/70">
                Don't wait for an estimate. If you have an active leak, call our emergency line now.
              </p>
              {company.emergencyPhone ? (
                <a
                  href={telHref(company.emergencyPhone)}
                  className="btn btn-accent mt-4"
                >
                  <Icon name="phone" size={16} />
                  {formatPhone(company.emergencyPhone)}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
