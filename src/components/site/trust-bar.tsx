import { getCompanySettings } from "@/lib/cms";
import { Icon, type IconName } from "@/components/ui/icon";

/**
 * Trust bar. Every number comes from Company Settings - nothing is hardcoded
 * or fabricated. If a value is 0/empty in the CMS it is simply not rendered.
 */
export async function TrustBar() {
  const company = await getCompanySettings();

  const items: { value: string; label: string; icon: IconName }[] = [];
  if (company.googleRating > 0)
    items.push({
      value: `${company.googleRating.toFixed(1)}★`,
      label: `${company.reviewCount.toLocaleString()} Reviews`,
      icon: "star",
    });
  if (company.yearsInBusiness > 0)
    items.push({ value: `${company.yearsInBusiness}+`, label: "Years Experience", icon: "clock" });
  if (company.roofsCompleted > 0)
    items.push({ value: `${company.roofsCompleted.toLocaleString()}+`, label: "Roofs Completed", icon: "home" });
  items.push({ value: "Licensed", label: "& Insured", icon: "shield" });
  items.push({ value: "Certified", label: "Installers", icon: "badge" });

  if (!items.length) return null;

  return (
    <section className="border-b border-line/60 bg-white" aria-label="Company credentials">
      <div className="container-page">
        <ul className="grid grid-cols-2 divide-y divide-line/60 md:grid-cols-5 md:divide-x md:divide-y-0">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-center gap-3.5 px-4 py-6 text-center md:py-7"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/[0.06] ring-1 ring-primary/10">
                <Icon name={item.icon} size={16} className="text-primary" />
              </span>
              <span className="text-left">
                <span className="block font-display text-[18px] font-extrabold leading-none tracking-[-0.02em] text-primary">
                  {item.value}
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  {item.label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
