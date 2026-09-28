import Link from "next/link";
import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";

/**
 * Storm damage / emergency section. The 24/7 claim is ONLY rendered when
 * emergency availability is enabled in Company Settings.
 */
export async function StormEmergency() {
  const company = await getCompanySettings();

  return (
    <section className="section" id="storm-damage">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-2">
          {/* Storm damage */}
          <div className="p-8 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary">
              <Icon name="bolt" size={24} />
            </span>
            <h2 className="mt-5">Storm Damage? Don&apos;t Wait.</h2>
            <p className="lead mt-4">
              Hail and high winds can damage a roof in ways that are invisible from the ground. We
              document the damage with photos, meet your adjuster on site, and restore your roof to
              manufacturer specifications.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              {["Hail and wind damage assessment", "Photo documentation for insurance claims", "Adjuster meet-ups", "Emergency tarping and board-up"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Icon name="check" size={16} className="shrink-0 text-accent" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/free-estimate/" className="btn btn-primary">
                Get an Emergency Inspection
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/storm-damage-roofing/" className="btn btn-outline">
                Storm Damage Resources
              </Link>
            </div>
          </div>

          {/* Emergency — high-contrast urgency panel */}
          <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-primary p-8 text-white md:p-10">
            <div
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 via-accent to-red-500"
              aria-hidden="true"
            />
            <div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-red-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                </span>
                Rapid Response
              </span>
              <h2 className="mt-5 text-white">Emergency Roofing</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                Active leak? Don&apos;t wait for it to spread. We prioritize emergency calls to stop water
                intrusion before it causes structural damage.
              </p>
            </div>

            <div className="relative">
              {company.emergencyAvailable ? (
                <div className="rounded-xl border border-white/15 bg-white/10 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Icon name="clock" size={16} className="text-accent" />
                    {company.emergencyHoursLabel || "Emergency service available"}
                  </div>
                  {company.emergencyPhone ? (
                    <a
                      href={telHref(company.emergencyPhone)}
                      className="mt-3 flex items-baseline gap-2 font-display text-2xl font-bold text-white"
                    >
                      <Icon name="phone" size={20} className="text-accent" />
                      {formatPhone(company.emergencyPhone)}
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-white/15 bg-white/10 p-5 text-sm text-white/70">
                  Emergency availability is currently not enabled for this location. Please call our
                  main line and we will respond as quickly as we can.
                </div>
              )}
              <Link href="/emergency-roofing/" className="btn btn-ghost-light mt-4">
                Emergency Roofing Info
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
