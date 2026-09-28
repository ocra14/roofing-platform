import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { CompanySetting, Media, Menu, MenuItem } from "@prisma/client";

export type CompanySettings = CompanySetting & {
  logo?: Media | null;
  favicon?: Media | null;
};

export type NavMenu = Menu & { items: MenuItem[] };

/**
 * Central company settings accessor. The company record is a singleton
 * (first row); every global component reads from here so that a new roofing
 * business can be configured purely from Admin > Company Settings.
 */
export const getCompanySettings = cache(async (): Promise<CompanySettings> => {
  const row = await prisma.companySetting.findFirst({
    include: { logo: true, favicon: true },
    orderBy: { createdAt: "asc" },
  });
  if (row) return row;
  // No settings yet (fresh database). Return an in-memory shape so the site
  // can render before seeding; Admin > Company Settings creates the row.
  return {
    id: "pending",
    name: "Your Roofing Company",
    tagline: "Professional Roofing Services",
    legalName: null,
    logoId: null,
    faviconId: null,
    description: null,
    phone: null,
    emergencyPhone: null,
    email: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    state: null,
    postalCode: null,
    country: "US",
    businessHours: null,
    emergencyAvailable: false,
    emergencyHoursLabel: null,
    yearsInBusiness: 0,
    roofsCompleted: 0,
    googleRating: 0,
    reviewCount: 0,
    licenseNumber: null,
    insuranceInfo: null,
    warrantySummary: null,
    websiteUrl: null,
    googleBusinessUrl: null,
    serviceAreaNote: null,
    socialFacebook: null,
    socialInstagram: null,
    socialX: null,
    socialYoutube: null,
    socialLinkedin: null,
    announcementEnabled: false,
    announcementText: null,
    announcementLink: null,
    announcementLabel: null,
    announcementBg: null,
    announcementStartAt: null,
    announcementEndAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    logo: null,
    favicon: null,
  };
});

/** Invalidate the in-memory cache (called after settings mutations in admin). */
export function invalidateCompanySettings() {
  // React's cache() is per-request; nothing to invalidate here. Kept for API
  // compatibility with future caching layers (e.g. revalidatePath callers).
}

/**
 * Load a named menu (header / footer / mobile) with ordered, enabled items.
 * Falls back to a sensible default if the menu has not been configured yet.
 */
export async function getMenu(slug: string): Promise<NavMenu | null> {
  const menu = await prisma.menu.findUnique({
    where: { slug },
    include: {
      items: {
        where: { isEnabled: true },
        orderBy: [{ order: "asc" }],
      },
    },
  });
  if (!menu) return menu;
  // Safety dedup — keep first item per order value (guards against seed re-runs that duplicated items)
  const seen = new Set<number>();
  const deduped = menu.items.filter((item) => {
    if (seen.has(item.order)) return false;
    seen.add(item.order);
    return true;
  });
  return { ...menu, items: deduped };
}

export const DEFAULT_HEADER_MENU: NavMenu = {
  id: "default-header",
  name: "Header",
  slug: "header",
  items: [
    { id: "s", menuId: "", label: "Services", url: "/roofing-services/", parentId: null, order: 1, isEnabled: true, isCTA: false },
    { id: "p", menuId: "", label: "Projects", url: "/projects/", parentId: null, order: 2, isEnabled: true, isCTA: false },
    { id: "a", menuId: "", label: "Service Areas", url: "/service-areas/", parentId: null, order: 3, isEnabled: true, isCTA: false },
    { id: "ab", menuId: "", label: "About", url: "/about/", parentId: null, order: 5, isEnabled: true, isCTA: false },
    { id: "r", menuId: "", label: "Reviews", url: "/reviews/", parentId: null, order: 6, isEnabled: true, isCTA: false },
    { id: "b", menuId: "", label: "Blog", url: "/blog/", parentId: null, order: 7, isEnabled: true, isCTA: false },
    { id: "c", menuId: "", label: "Contact", url: "/contact/", parentId: null, order: 8, isEnabled: true, isCTA: false },
  ] as MenuItem[],
};

export const DEFAULT_FOOTER_MENU: NavMenu = {
  id: "default-footer",
  name: "Footer",
  slug: "footer",
  items: [
    { id: "fs", menuId: "", label: "Services", url: "/roofing-services/", parentId: null, order: 1, isEnabled: true, isCTA: false },
    { id: "fp", menuId: "", label: "Projects", url: "/projects/", parentId: null, order: 2, isEnabled: true, isCTA: false },
    { id: "fa", menuId: "", label: "Service Areas", url: "/service-areas/", parentId: null, order: 3, isEnabled: true, isCTA: false },
    { id: "fr", menuId: "", label: "Reviews", url: "/reviews/", parentId: null, order: 5, isEnabled: true, isCTA: false },
    { id: "fb", menuId: "", label: "Blog", url: "/blog/", parentId: null, order: 6, isEnabled: true, isCTA: false },
    { id: "fc", menuId: "", label: "Contact", url: "/contact/", parentId: null, order: 7, isEnabled: true, isCTA: false },
  ] as MenuItem[],
};

/** Site-wide branding tokens, stored as SiteSetting rows in the "appearance" group. */
export type Branding = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  buttonRadius: string;
  cardRadius: string;
  headerStyle: "solid" | "transparent";
  announcementBg: string;
};

export const DEFAULT_BRANDING: Branding = {
  primaryColor: "#0f2745",
  secondaryColor: "#1d4ed8",
  accentColor: "#d97706",
  textColor: "#111827",
  mutedTextColor: "#4b5563",
  backgroundColor: "#f7f8fa",
  surfaceColor: "#ffffff",
  borderColor: "#e3e7ec",
  headingFont: "var(--font-display)",
  bodyFont: "var(--font-body)",
  buttonRadius: "0.5rem",
  cardRadius: "0.75rem",
  headerStyle: "solid",
  announcementBg: "#0f2745",
};

export async function getBranding(): Promise<Branding> {
  const rows = await prisma.siteSetting.findMany({
    where: { group: "appearance" },
  });
  const map = new Map(rows.map((r) => [r.key, r.value ?? ""]));
  return { ...DEFAULT_BRANDING, ...Object.fromEntries(map) } as Branding;
}

export async function getTracking(): Promise<{
  googleAnalytics?: string;
  googleTagManager?: string;
  searchConsoleVerification?: string;
  metaPixel?: string;
  headScripts?: string;
  bodyScripts?: string;
  footerScripts?: string;
}> {
  const rows = await prisma.siteSetting.findMany({
    where: { group: "tracking" },
  });
  return Object.fromEntries(rows.map((r) => [r.key, r.value || undefined]));
}
