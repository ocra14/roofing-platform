import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { DynamicForm } from "@/components/site/dynamic-form";
import { Icon, type IconName } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/contact/",
    title: "Contact Us",
    description:
      "Contact our roofing team by phone, email, or message. Free estimates, emergency service, and local expertise.",
  })),
};

export default async function ContactPage() {
  const [company, form] = await Promise.all([
    getCompanySettings(),
    prisma.form.findUnique({
      where: { slug: "contact" },
      include: { fields: { where: { isEnabled: true }, orderBy: { order: "asc" } } },
    }),
  ]);

  const address = [company.addressLine1, company.addressLine2].filter(Boolean).join(", ");
  const cityState = [company.city, company.state, company.postalCode].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent([address, cityState].filter(Boolean).join(" "));
  const mapSrc = company.googleBusinessUrl || (mapQuery ? `https://maps.google.com/maps?q=${mapQuery}&output=embed` : "");

  const details: { icon: IconName; label: string; value?: string | null; href?: string }[] = [];
  if (company.phone)
    details.push({ icon: "phone", label: "Phone", value: formatPhone(company.phone), href: telHref(company.phone) });
  if (company.emergencyAvailable && company.emergencyPhone)
    details.push({
      icon: "siren",
      label: company.emergencyHoursLabel || "Emergency Line",
      value: formatPhone(company.emergencyPhone),
      href: telHref(company.emergencyPhone),
    });
  if (company.email)
    details.push({ icon: "mail", label: "Email", value: company.email, href: `mailto:${company.email}` });
  if (address || cityState)
    details.push({ icon: "map-pin", label: "Address", value: [address, cityState].filter(Boolean).join("\n") });
  if (company.businessHours) details.push({ icon: "clock", label: "Business Hours", value: company.businessHours });

  return (
    <>
      <PageHero
        title="Contact Our Roofing Team"
        eyebrow="Contact"
        description="Questions about a repair, a quote, or a storm claim? Reach out - a real person will respond, usually within one business day."
        crumbs={[{ name: "Home", url: "/" }, { name: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2>Get in Touch</h2>
            <ul className="mt-7 space-y-5">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon name={d.icon} size={19} />
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-muted">{d.label}</div>
                    {d.href ? (
                      <a href={d.href} className="mt-0.5 block whitespace-pre-line text-base font-semibold text-ink hover:text-primary">
                        {d.value}
                      </a>
                    ) : (
                      <div className="mt-0.5 whitespace-pre-line text-base font-semibold text-ink">{d.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {mapSrc ? (
              <div className="mt-9 overflow-hidden rounded-xl border border-line">
                <iframe
                  title="Company location map"
                  src={mapSrc}
                  width="100%"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0, display: "block" }}
                />
              </div>
            ) : null}
          </div>

          <div>
            <div className="card p-7 md:p-8">
              <h2 className="text-lg">Send a Message</h2>
              <p className="mt-2.5 text-sm text-muted">
                For faster service on urgent issues, please call us directly.
              </p>
              <div className="mt-6">
                {form && form.isEnabled ? (
                  <DynamicForm
                    formSlug={form.slug}
                    fields={form.fields}
                    submitLabel={form.submitLabel || "Send Message"}
                    successMessage={form.successMessage}
                    redirectUrl={form.redirectUrl}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
                    The contact form is currently unavailable.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
