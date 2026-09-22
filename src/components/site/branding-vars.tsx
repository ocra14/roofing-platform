import { getBranding, getCompanySettings, getTracking } from "@/lib/cms";

/**
 * Injects CMS-controlled brand tokens as CSS custom properties on <html>.
 * This is what makes the platform re-skinnable without touching code:
 * colours, radii and fonts all flow from Admin > Appearance.
 */
export async function BrandingVars() {
  const [branding, company] = await Promise.all([getBranding(), getCompanySettings()]);
  const vars: Record<string, string> = {
    "--brand-primary": branding.primaryColor,
    "--brand-primary-foreground": "#ffffff",
    "--brand-secondary": branding.secondaryColor,
    "--brand-secondary-foreground": "#ffffff",
    "--brand-accent": branding.accentColor,
    "--brand-accent-foreground": "#ffffff",
    "--brand-text": branding.textColor,
    "--brand-muted": branding.mutedTextColor,
    "--brand-surface": branding.surfaceColor,
    "--brand-canvas": branding.backgroundColor,
    "--brand-line": branding.borderColor,
    "--brand-radius-button": branding.buttonRadius,
    "--brand-radius-card": branding.cardRadius,
    "--brand-announcement": branding.announcementBg || branding.primaryColor,
  };

  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `:root{${Object.entries(vars)
          .map(([k, v]) => `${k}:${v};`)
          .join("")}}`,
      }}
    />
  );
}

/** Exposes company identity to the document head for social/OG defaults. */
export async function CompanyHeadMeta() {
  const [company, tracking] = await Promise.all([getCompanySettings(), getTracking()]);
  return (
    <>
      {company.favicon?.url ? (
        <link rel="icon" href={company.favicon.url} />
      ) : (
        <link rel="icon" href="/favicon.svg" />
      )}
      {tracking.searchConsoleVerification ? (
        <meta
          name="google-site-verification"
          content={tracking.searchConsoleVerification}
        />
      ) : null}
      {company.googleBusinessUrl ? (
        <meta name="business:contact_data:website" content={company.googleBusinessUrl} />
      ) : null}
    </>
  );
}
