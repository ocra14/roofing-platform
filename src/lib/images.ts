/**
 * Real roofing imagery for the platform.
 * All images are from Unsplash (free for commercial use, no attribution required).
 * Every photo shows actual roofing work, crews, materials, or houses with
 * clearly visible roofs — no luxury interiors. URLs with w/h params keep
 * them fast and sharp at every breakpoint.
 */

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=center`;

export const ROOF_IMAGES = {
  // Hero — roofing crew installing shingles on a steep roof
  hero: u("1763665814605-a6489a3bf2a0", 1200, 900),
  heroAlt: u("1568605114967-8130f3a36994", 1200, 900),

  // Projects — roofing work first, houses with visible roofs second
  projects: [
    // Crew installing shingles
    u("1763665814605-a6489a3bf2a0", 800, 600),
    // Repairing storm-damaged roof
    u("1760331840361-d751cfc1becf", 800, 600),
    // Tile roof repair
    u("1770149682967-5733992e49ff", 800, 600),
    // House with visible shingle roof
    u("1568605114967-8130f3a36994", 800, 600),
    // Suburban home, roofline visible
    u("1570129477492-45c003edd2be", 800, 600),
    // Modern home exterior with roof
    u("1600585152220-90363fe7e115", 800, 600),
    // Commercial-scale construction crew
    u("1504307651254-35680f356dfd", 800, 600),
    // Active job site
    u("1541888946425-d81bb19240f5", 800, 600),
  ],

  // Before / after — damaged roof vs. fresh shingle install
  beforeAfter: {
    before: u("1760331840361-d751cfc1becf", 960, 600),
    after: u("1763665814605-a6489a3bf2a0", 960, 600),
  },

  // Services — each card shows its own trade (all unique, all roofing)
  services: {
    repair: u("1770149682967-5733992e49ff", 800, 600),
    replacement: u("1600585152220-90363fe7e115", 800, 600),
    inspection: u("1473968512647-3e447244af8f", 800, 600),
    storm: u("1534088568595-a066f410bcda", 800, 600),
    emergency: u("1760331840361-d751cfc1becf", 800, 600),
    commercial: u("1504307651254-35680f356dfd", 800, 600),
    maintenance: u("1581578731548-c64695cc6952", 800, 600),
    gutters: u("1605146769289-440113cc3d00", 800, 600),
  },

  // Blog
  blog: [
    u("1763665814605-a6489a3bf2a0", 800, 450),
    u("1760331840361-d751cfc1becf", 800, 450),
    u("1568605114967-8130f3a36994", 800, 450),
  ],

  // Service areas / locations — suburban home with visible roof
  location: u("1570129477492-45c003edd2be", 800, 560),

  // About — crew at work, not a stock interior
  about: u("1504307651254-35680f356dfd", 800, 600),
  team: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  ],
} as const;

/**
 * Get a real project image by index (cycles through the array).
 */
export function projectImage(index: number): string {
  return ROOF_IMAGES.projects[index % ROOF_IMAGES.projects.length];
}

/**
 * Image for a service detail/card, keyed by service slug.
 * Single source of truth — service cards, detail heroes (via Img fallback),
 * and the services index page all resolve through here.
 */
const SERVICE_IMAGE_BY_SLUG: Record<string, string> = {
  "roof-repair": ROOF_IMAGES.services.repair,
  "roof-replacement": ROOF_IMAGES.services.replacement,
  "roofing-inspection": ROOF_IMAGES.services.inspection,
  "storm-damage-roofing": ROOF_IMAGES.services.storm,
  "emergency-roofing": ROOF_IMAGES.services.emergency,
  "commercial-roofing": ROOF_IMAGES.services.commercial,
  "roof-maintenance": ROOF_IMAGES.services.maintenance,
  gutters: ROOF_IMAGES.services.gutters,
};

export function serviceImage(slug: string): string {
  return SERVICE_IMAGE_BY_SLUG[slug] ?? ROOF_IMAGES.projects[0];
}

/**
 * Get a blog image by index.
 */
export function blogImage(index: number): string {
  return ROOF_IMAGES.blog[index % ROOF_IMAGES.blog.length];
}
