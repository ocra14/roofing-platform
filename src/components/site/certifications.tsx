import { getCompanySettings } from "@/lib/cms";
import { Icon, type IconName } from "@/components/ui/icon";

/**
 * Certifications / trust strip.
 * Renders only factual credentials that have actually been entered in
 * Company Settings. No manufacturer logos or certifications are invented.
 */
export async function Certifications() {
  const company = await getCompanySettings();

  const items: { icon: IconName; label: string; value?: string | null }[] = [];
  if (company.licenseNumber)
    items.push({ icon: "shield", label: "Licensed", value: company.licenseNumber });
  if (company.insuranceInfo)
    items.push({ icon: "badge", label: "Insured", value: company.insuranceInfo });
  if (company.warrantySummary)
    items.push({ icon: "check", label: "Warranty", value: company.warrantySummary });
  if (company.yearsInBusiness > 0)
    items.push({ icon: "clock", label: "Established", value: `${company.yearsInBusiness}+ years` });

  if (!items.length) return null;

  return (
    <section className="border-y border-line/60 bg-canvas py-8" aria-label="Credentials">
      <div className="container-page">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3.5 rounded-xl border border-line/40 bg-white px-4 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.06] ring-1 ring-primary/10">
                <Icon name={item.icon} size={15} className="text-primary" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                  {item.label}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
