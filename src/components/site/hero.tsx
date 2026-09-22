import Link from "next/link";
import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { Img } from "@/components/ui/img";
import { ROOF_IMAGES } from "@/lib/images";
import { formatPhone, telHref } from "@/lib/utils";

export async function Hero() {
  const company = await getCompanySettings();

  const stats = [
    { value: company.yearsInBusiness ? `${company.yearsInBusiness}+` : null, label: "Years in Business" },
    { value: company.roofsCompleted ? `${company.roofsCompleted.toLocaleString()}+` : null, label: "Roofs Completed" },
  ].filter((s) => s.value);

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Subtle architectural texture */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 72px)`,
        }}
      />
      <div
        suppressHydrationWarning
        className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-white/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div
        suppressHydrationWarning
        className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent/[0.08] blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-12 py-14 md:gap-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24 lg:gap-12">
        {/* Copy */}
        <div className="max-w-[560px]">
          {company.googleRating > 0 ? (
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 backdrop-blur">
              <Stars rating={company.googleRating} size={14} />
              <span className="text-[13px] font-bold tracking-[-0.01em]">{company.googleRating.toFixed(1)}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
                · {company.reviewCount.toLocaleString()} Google reviews
              </span>
            </div>
          ) : null}

          <h1 className="font-display text-[32px] font-extrabold leading-[0.95] tracking-[-0.03em] text-white sm:text-[40px] lg:text-[46px]">
            {company.city && company.state ? (
              <>
                {company.city} Roofing
                <br />
                <span className="font-light tracking-[-0.02em] text-white/90">Experts You Can Trust</span>
              </>
            ) : (
              <>
                Roofing Experts
                <br />
                <span className="font-light tracking-[-0.02em] text-white/90">You Can Trust</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-white/70 lg:text-[17px]">
            {company.description
              ? company.description.slice(0, 160) + (company.description.length > 160 ? "…" : "")
              : "Professional roof repair, roof replacement, storm damage restoration, and commercial roofing for homeowners and businesses across the region."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/free-estimate/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[14px] font-bold tracking-[-0.01em] text-white shadow-[0_4px_20px_rgba(217,119,6,0.4)] transition-all hover:bg-accent/90 hover:shadow-[0_6px_28px_rgba(217,119,6,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Your Free Roof Inspection
              <Icon name="arrow-right" size={15} />
            </Link>
            {company.phone ? (
              <a
                href={telHref(company.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-[14px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                <Icon name="phone" size={15} />
                {formatPhone(company.phone)}
              </a>
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-7">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[-0.01em] text-white/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/12">
                <Icon name="shield" size={12} className="text-accent" />
              </span>
              Licensed & Insured
            </span>
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[-0.01em] text-white/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/12">
                <Icon name="badge" size={12} className="text-accent" />
              </span>
              Manufacturer Certified
            </span>
            {company.yearsInBusiness > 0 ? (
              <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[-0.01em] text-white/80">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/12">
                  <Icon name="clock" size={12} className="text-accent" />
                </span>
                {company.yearsInBusiness}+ Years
              </span>
            ) : null}
          </div>
        </div>

        {/* Visual */}
        <div className="relative lg:pl-4">
          <div className="relative overflow-hidden rounded-[20px] shadow-[0_20px_60px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/15">
            <Img
              src={ROOF_IMAGES.hero}
              alt={`${company.name} roofing project`}
              width={800}
              height={620}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3.15] w-full object-cover"
              fallbackLabel="Completed roofing project"
              fallbackTone="blue"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/10" aria-hidden="true" />
          </div>

          {stats.length ? (
            <div className="absolute -bottom-5 -left-4 hidden max-w-[300px] rounded-2xl border border-line/60 bg-white p-5 shadow-[0_12px_40px_-12px_rgba(15,39,69,0.3)] sm:block lg:-left-6">
              <div className="grid grid-cols-2 gap-5">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[26px] font-extrabold leading-none tracking-[-0.02em] text-primary">
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {company.emergencyAvailable && company.emergencyPhone ? (
        <div className="relative border-t border-white/10 bg-black/15 backdrop-blur">
          <div className="container-page flex items-center justify-center gap-3 py-3 text-[13px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
              <Icon name="siren" size={13} className="text-red-400" />
            </span>
            <span className="font-semibold tracking-[-0.01em] text-white/90">
              {company.emergencyHoursLabel || "Emergency Service"}
            </span>
            <span className="hidden text-white/30 sm:inline">·</span>
            <a
              href={telHref(company.emergencyPhone)}
              className="font-bold tracking-[-0.01em] text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {formatPhone(company.emergencyPhone)}
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
