import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";

/**
 * Optional top announcement bar.
 * Enabled, text, link, CTA label, background and scheduling window are all
 * controlled from Admin > Company Settings.
 */
export async function AnnouncementBar() {
  const company = await getCompanySettings();

  if (!company.announcementEnabled || !company.announcementText?.trim()) return null;

  const now = new Date();
  if (company.announcementStartAt && now < company.announcementStartAt) return null;
  if (company.announcementEndAt && now > company.announcementEndAt) return null;

  const bg = company.announcementBg || "var(--brand-announcement)";

  return (
    <div
      className="relative z-50 text-white"
      style={{ backgroundColor: bg }}
      role="region"
      aria-label="Announcement"
    >
      <div className="container-page flex items-center justify-center gap-3 py-2 text-center text-sm sm:py-2.5">
        <Icon name="bolt" size={15} className="shrink-0 opacity-90" />
        <span className="font-medium tracking-tight">{company.announcementText}</span>
        {company.announcementLink && company.announcementLabel ? (
          <a
            href={company.announcementLink}
            className="hidden shrink-0 items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline sm:inline-flex"
          >
            {company.announcementLabel}
            <Icon name="arrow-right" size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

/** Compact emergency strip used on emergency-related pages. */
export async function EmergencyStrip() {
  const company = await getCompanySettings();
  if (!company.emergencyAvailable || !company.emergencyPhone) return null;
  return (
    <div className="bg-red-700 text-white">
      <div className="container-page flex items-center justify-center gap-3 py-2 text-center text-sm">
        <Icon name="siren" size={15} className="shrink-0" />
        <span className="font-medium">{company.emergencyHoursLabel || "Emergency service available"}</span>
        <a href={telHref(company.emergencyPhone)} className="font-bold underline underline-offset-2">
          {formatPhone(company.emergencyPhone)}
        </a>
      </div>
    </div>
  );
}
