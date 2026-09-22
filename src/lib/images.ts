/**
 * Real roofing imagery for the platform.
 * All images are from Unsplash (free for commercial use, no attribution required).
 * URLs include w/h params for appropriate sizing — they load fast and look sharp
 * at every breakpoint.
 */

export const ROOF_IMAGES = {
  // Hero — premium house with beautiful roof, warm light
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=900&fit=crop&crop=center",
  heroAlt: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop&crop=center",

  // Projects — diverse roofing work
  projects: [
    // Asphalt shingle — classic residential
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop&crop=center",
    // Modern house / architectural
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center",
    // Metal roofing
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center",
    // Tile roofing
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center",
    // Flat / commercial
    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&crop=center",
    // Roof detail / shingles close-up
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center",
    // Crew working
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center",
    // Another residential angle
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center",
  ],

  // Before / after pairs — use same style but different images for contrast
  beforeAfter: {
    before: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=960&h=600&fit=crop&crop=center",
    after: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=960&h=600&fit=crop&crop=center",
  },

  // Services
  services: {
    repair: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center",
    replacement: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center",
    inspection: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center",
    storm: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop&crop=center",
    emergency: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center",
    commercial: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&crop=center",
    maintenance: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center",
    gutters: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center",
  },

  // Blog
  blog: [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=450&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=450&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=450&fit=crop&crop=center",
  ],

  // Service areas / locations
  location: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=560&fit=crop&crop=center",

  // About / team
  about: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center",
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
 * Get a blog image by index.
 */
export function blogImage(index: number): string {
  return ROOF_IMAGES.blog[index % ROOF_IMAGES.blog.length];
}
