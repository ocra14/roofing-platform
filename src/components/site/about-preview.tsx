import Link from "next/link";
import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";

export async function AboutPreview() {
  const company = await getCompanySettings();

  const points = [
    company.yearsInBusiness > 0 ? `${company.yearsInBusiness}+ years serving local homeowners` : null,
    company.roofsCompleted > 0 ? `${company.roofsCompleted.toLocaleString()}+ roofs completed` : null,
    company.licenseNumber ? `Licensed: ${company.licenseNumber}` : null,
    company.warrantySummary ? "Written workmanship warranty on every install" : null,
  ].filter(Boolean);

  return (
    <section className="section bg-surface" id="about">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div
              className="absolute -left-6 -top-6 h-32 w-32 rounded-lg border-2 border-accent/30"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl bg-primary p-10 shadow-xl">
              <Icon name="home" size={40} className="text-white/30" />
              <p className="mt-6 font-display text-2xl font-semibold leading-snug text-white">
                “We treat every roof as if it were on our own home.”
              </p>
              <p className="mt-4 text-sm text-white/65">
                {company.name}
                {company.city && company.state ? ` — ${company.city}, ${company.state}` : ""}
              </p>
            </div>
          </div>

          <div>
            <span className="eyebrow">About {company.name}</span>
            <h2 className="mt-3">A Local Company Built on Trust</h2>
            <p className="lead mt-4">
              {company.description || "Learn more about our team, our values, and our commitment to quality workmanship."}
            </p>

            {points.length ? (
              <ul className="mt-7 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-ink/85">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8">
              <Link href="/about/" className="btn btn-primary">
                Learn More About Us
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
