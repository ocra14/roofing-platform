import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-field";
import { Icon } from "@/components/ui/icon";
import { saveCompanySettings, toggleDemoMode } from "@/lib/actions/settings";

export const metadata = { title: "Company Settings" };

export default async function AdminSettingsPage() {
  const company = await getCompanySettings();
  const existing = await prisma.companySetting.findFirst({ orderBy: { createdAt: "asc" } });
  const id = existing?.id ?? "company";

  return (
    <div>
      <AdminPageHeader
        title="Company Settings"
        description="The single source of truth for your business. Everything on the website - header, footer, SEO, trust stats - reads from this page."
      />

      <form action={saveCompanySettings} className="space-y-6">
        <input type="hidden" name="id" value={id} />

        <AdminCard
          title="Company Identity"
          description="Your name, tagline, and logo appear in the header, footer, and across the site."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingsField name="name" label="Company Name" defaultValue={company.name} required />
            <SettingsField name="tagline" label="Tagline" defaultValue={company.tagline ?? ""} placeholder="Dallas-Fort Worth Roofing Experts" />
            <SettingsField name="legalName" label="Legal Entity Name" defaultValue={company.legalName ?? ""} />
            <div className="sm:col-span-2">
              <ImageField
                name="logoUrl"
                label="Logo Image"
                defaultValue={company.logo?.url ?? ""}
                helpText="Drop your logo here, or paste an image URL. Shown in the header and footer."
                folder="branding"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageField
                name="faviconUrl"
                label="Favicon"
                defaultValue={company.favicon?.url ?? ""}
                helpText="Small icon shown in browser tabs. Square PNG works best."
                folder="branding"
              />
            </div>
            <SettingsField name="websiteUrl" label="Website URL" defaultValue={company.websiteUrl ?? ""} />
            <div className="sm:col-span-2">
              <label className="field-label">Company Description</label>
              <textarea name="description" rows={3} defaultValue={company.description ?? ""} className="field-textarea" />
              <p className="mt-1.5 text-xs text-muted">Used for the About section and default SEO description.</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Contact Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingsField name="phone" label="Primary Phone" defaultValue={company.phone ?? ""} placeholder="(214) 555-0100" />
            <SettingsField name="email" label="Email Address" defaultValue={company.email ?? ""} />
            <SettingsField name="addressLine1" label="Street Address" defaultValue={company.addressLine1 ?? ""} />
            <SettingsField name="addressLine2" label="Address Line 2" defaultValue={company.addressLine2 ?? ""} />
            <SettingsField name="city" label="City" defaultValue={company.city ?? ""} />
            <SettingsField name="state" label="State" defaultValue={company.state ?? ""} />
            <SettingsField name="postalCode" label="ZIP Code" defaultValue={company.postalCode ?? ""} />
            <SettingsField name="businessHours" label="Business Hours" defaultValue={company.businessHours ?? ""} helpText="Shown in the footer and contact page." />
          </div>
        </AdminCard>

        <AdminCard
          title="Emergency Service"
          description="Emergency availability is only advertised when you enable it here - never implied automatically."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                name="emergencyAvailable"
                defaultChecked={company.emergencyAvailable}
                className="h-5 w-5 rounded border-line text-secondary"
              />
              <span className="text-sm font-medium text-ink">Emergency service available</span>
            </label>
            <SettingsField name="emergencyPhone" label="Emergency Phone" defaultValue={company.emergencyPhone ?? ""} />
            <SettingsField
              name="emergencyHoursLabel"
              label="Availability Label"
              defaultValue={company.emergencyHoursLabel ?? ""}
              placeholder="24/7 Emergency Service"
              helpText="Only show a 24/7 claim if you truly offer it."
            />
          </div>
        </AdminCard>

        <AdminCard
          title="Trust & Statistics"
          description="These numbers appear in the trust bar and hero. Enter real figures only - they are presented as facts on your website."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingsField name="yearsInBusiness" label="Years in Business" type="number" defaultValue={String(company.yearsInBusiness ?? 0)} />
            <SettingsField name="roofsCompleted" label="Roofs Completed" type="number" defaultValue={String(company.roofsCompleted ?? 0)} />
            <SettingsField name="googleRating" label="Google Rating" type="number" step="0.1" defaultValue={String(company.googleRating ?? 0)} />
            <SettingsField name="reviewCount" label="Total Review Count" type="number" defaultValue={String(company.reviewCount ?? 0)} />
            <SettingsField name="licenseNumber" label="License Number" defaultValue={company.licenseNumber ?? ""} />
            <SettingsField name="insuranceInfo" label="Insurance Information" defaultValue={company.insuranceInfo ?? ""} helpText="Carrier and coverage limits." />
            <SettingsField name="warrantySummary" label="Warranty Summary" defaultValue={company.warrantySummary ?? ""} />
            <SettingsField name="googleBusinessUrl" label="Google Business Profile URL" defaultValue={company.googleBusinessUrl ?? ""} />
            <SettingsField name="serviceAreaNote" label="Service Area Summary" defaultValue={company.serviceAreaNote ?? ""} helpText="Used for structured data (areaServed)." />
          </div>
        </AdminCard>

        <AdminCard
          title="Announcement Bar"
          description="The optional strip at the very top of every page. Leave blank to hide."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                name="announcementEnabled"
                defaultChecked={company.announcementEnabled}
                className="h-5 w-5 rounded border-line text-secondary"
              />
              <span className="text-sm font-medium text-ink">Show announcement bar</span>
            </label>
            <SettingsField name="announcementBg" label="Background Color" type="color" defaultValue={company.announcementBg ?? "#0f2745"} />
            <div className="sm:col-span-2">
              <label className="field-label">Announcement Text</label>
              <input name="announcementText" defaultValue={company.announcementText ?? ""} className="field-input" placeholder="24/7 Emergency Roofing & Free Storm Damage Inspections" />
            </div>
            <SettingsField name="announcementLabel" label="Link Label" defaultValue={company.announcementLabel ?? ""} placeholder="Call Now" />
            <SettingsField name="announcementLink" label="Link URL" defaultValue={company.announcementLink ?? ""} placeholder="tel:+12145550199" />
          </div>
        </AdminCard>

        <AdminCard title="Social Media">
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingsField name="socialFacebook" label="Facebook URL" defaultValue={company.socialFacebook ?? ""} />
            <SettingsField name="socialInstagram" label="Instagram URL" defaultValue={company.socialInstagram ?? ""} />
            <SettingsField name="socialX" label="X (Twitter) URL" defaultValue={company.socialX ?? ""} />
            <SettingsField name="socialYoutube" label="YouTube URL" defaultValue={company.socialYoutube ?? ""} />
            <SettingsField name="socialLinkedin" label="LinkedIn URL" defaultValue={company.socialLinkedin ?? ""} />
          </div>
        </AdminCard>

        <div className="flex items-center justify-end gap-3">
          <button type="submit" className="btn btn-primary btn-lg">
            <Icon name="save" size={17} />
            Save Company Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsField({
  name,
  label,
  defaultValue,
  placeholder,
  helpText,
  required,
  type = "text",
  step,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  type?: "text" | "number" | "color";
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={`setting-${name}`} className="field-label">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      <input
        id={`setting-${name}`}
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={type === "color" ? "h-10 w-full rounded-md border border-line p-1.5" : "field-input"}
      />
      {helpText ? <p className="mt-1.5 text-xs text-muted">{helpText}</p> : null}
    </div>
  );
}
