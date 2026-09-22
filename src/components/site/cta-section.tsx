import Link from "next/link";
import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";

export async function CtaSection({
  title,
  description,
  primaryLabel,
  primaryUrl = "/free-estimate/",
  showPhone = true,
  variant = "primary",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  showPhone?: boolean;
  variant?: "primary" | "surface";
}) {
  const company = await getCompanySettings();
  const dark = variant === "primary";

  return (
    <section className={dark ? "section surface-dark" : "section"}>
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-7 py-12 text-white md:px-12 md:py-16">
          <div
            className="absolute inset-0 opacity-[0.06]"
            aria-hidden="true"
            style={{ backgroundImage: "repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 90px)" }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-white">{title || "Ready for a Free Roof Inspection?"}</h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
                {description ||
                  "Get an honest, written assessment with photos. No pressure, no hidden fees - just a clear picture of your roof's condition and your options."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <Link href={primaryUrl} className="btn btn-accent btn-lg">
                <Icon name="send" size={17} />
                {primaryLabel || "Get a Free Estimate"}
              </Link>
              {showPhone && company.phone ? (
                <a href={telHref(company.phone)} className="btn btn-ghost-light btn-lg">
                  <Icon name="phone" size={17} />
                  Call {formatPhone(company.phone)}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
