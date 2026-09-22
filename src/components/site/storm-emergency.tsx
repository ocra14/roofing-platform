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
            <h2 className="mt-5">Storm Damage Specialists</h2>
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
            <div className="mt-7">
              <Link href="/storm-damage-roofing/" className="btn btn-primary">
                Storm Damage Resources
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>

          {/* Emergency */}
          <div className="flex flex-col justify-between gap-8 bg-primary p-8 text-white md:p-10">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/12 text-white">
                <Icon name="siren" size={24} />
              </span>
              <h2 className="mt-5 text-white">Emergency Roofing</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                Active leak? Don't wait for it to spread. We prioritize emergency calls to stop water
                intrusion before it causes structural damage.
              </p>
            </div>

            <div>
              {company.emergencyAvailable ? (
                <div className="rounded-xl bg-white/10 p-5">
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
                <div className="rounded-xl bg-white/10 p-5 text-sm text-white/70">
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
