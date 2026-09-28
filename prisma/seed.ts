/* eslint-disable no-console */
//
// ===========================================================================
// Seed data - DEMO COMPANY
// ---------------------------------------------------------------------------
// Everything below is fictional placeholder content used solely so the
// platform can be viewed end-to-end immediately after install.
//
// It is NOT real business data: the company, reviews, project stats,
// certifications and license number are invented. Replace them from
// Admin > Company Settings (and the other CMS modules) before going live.
//
// A `demoMode = true` SiteSetting flag is written so the admin UI can
// surface a "replace this demo content" notice.
// ===========================================================================
//
import bcrypt from "bcryptjs";
import { FormFieldType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/utils";

async function main() {
  console.log("Seeding demo data …");

  // ---------------------------------------------------------------- users
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@roofingdemo.test" },
    update: {},
    create: {
      name: "Site Administrator",
      email: "admin@roofingdemo.test",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  const editor = await prisma.user.upsert({
    where: { email: "editor@roofingdemo.test" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@roofingdemo.test",
      passwordHash: await bcrypt.hash("editor123", 10),
      role: "EDITOR",
      isActive: true,
    },
  });
  const sales = await prisma.user.upsert({
    where: { email: "sales@roofingdemo.test" },
    update: {},
    create: {
      name: "Sales Rep",
      email: "sales@roofingdemo.test",
      passwordHash: await bcrypt.hash("sales123", 10),
      role: "SALES",
      isActive: true,
    },
  });
  console.log(`  users: ${admin.email}, ${editor.email}, ${sales.email}`);

  // ------------------------------------------------------------- settings
  await prisma.companySetting.upsert({
    where: { id: "company" },
    update: {},
    create: {
      id: "company",
      name: "Lone Star Roofing Co.",
      tagline: "Dallas-Fort Worth Roofing Experts",
      legalName: "Lone Star Roofing Co., LLC (demo)",
      description:
        "Professional roof repair, roof replacement, storm damage restoration and commercial roofing for homeowners across Dallas-Fort Worth. (Demo content - replace with your company information.)",
      phone: "(214) 555-0188",
      emergencyPhone: "(214) 555-0199",
      email: "hello@lonestarroofingdemo.test",
      addressLine1: "1400 Commerce Street, Suite 300",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      emergencyAvailable: true,
      emergencyHoursLabel: "24/7 Emergency Service",
      yearsInBusiness: 18,
      roofsCompleted: 4200,
      googleRating: 4.8,
      reviewCount: 327,
      licenseNumber: "Demo-ROC-000000 (replace with real license)",
      insuranceInfo: "Demo - General liability and workers' compensation. Replace with your carrier and policy limits.",
      warrantySummary:
        "Demo - Manufacturer material warranty plus a workmanship warranty. Enter your actual warranty terms here.",
      websiteUrl: "https://lonestarroofingdemo.test",
      googleBusinessUrl: "https://maps.google.com/?cid=000000000000000000000 (demo)",
      serviceAreaNote: "Dallas-Fort Worth metroplex and surrounding communities",
      socialFacebook: "https://facebook.com/",
      socialInstagram: "https://instagram.com/",
      socialYoutube: "https://youtube.com/",
      announcementEnabled: true,
      announcementText: "24/7 Emergency Roofing & Free Storm Damage Inspections",
      announcementLabel: "Call Now",
      announcementLink: "tel:+12145550199",
      announcementBg: "#0f2745",
    },
  });

  // Appearance tokens
  const appearance: Record<string, string> = {
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
  };
  for (const [key, value] of Object.entries(appearance)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value, group: "appearance" },
    });
  }
  // System flags
  await prisma.siteSetting.upsert({
    where: { key: "demoMode" },
    update: {},
    create: { key: "demoMode", value: "true", group: "system" },
  });
  const tracking: Record<string, string> = {
    googleAnalytics: "",
    googleTagManager: "",
    searchConsoleVerification: "",
    metaPixel: "",
    headScripts: "",
    bodyScripts: "",
    footerScripts: "",
  };
  for (const [key, value] of Object.entries(tracking)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value, group: "tracking" },
    });
  }

  // ------------------------------------------------------------ services
  type ServiceSeed = {
    name: string;
    slug: string;
    kind?: string;
    excerpt: string;
    description: string;
    icon: string;
    isFeatured?: boolean;
    benefits: string[];
    process: { title: string; description: string }[];
    faqs: { question: string; answer: string }[];
    warranty?: string;
    financingNote?: string;
  };

  const services: ServiceSeed[] = [
    {
      name: "Roof Repair",
      slug: "roof-repair",
      excerpt: "Fast, lasting repairs for leaks, missing shingles, flashing and storm damage.",
      description:
        "A small leak can become a major problem. Our roof repair service finds the true source of the issue and fixes it correctly the first time. We handle leaks, missing or damaged shingles, flashing failures, vent pipe boots, skylight leaks, and emergency tarping. Every repair includes a written assessment of the surrounding roof condition so you understand what can be repaired now and what may need attention later.",
      icon: "wrench",
      isFeatured: true,
      benefits: [
        "Leak detection and repair",
        "Missing or damaged shingle replacement",
        "Flashing and skylight sealing",
        "Emergency tarping available",
        "Written condition assessment",
      ],
      process: [
        { title: "Request inspection", description: "Call or request a visit online; we schedule promptly, often same-week." },
        { title: "On-roof inspection", description: "We inspect the reported area plus the surrounding roof and attic." },
        { title: "Written repair scope", description: "You receive a clear, itemized repair quote with photos." },
        { title: "Repair work", description: "We complete the repair with matching materials and clean up fully." },
        { title: "Final walkthrough", description: "We review the completed work and answer your questions." },
      ],
      faqs: [
        { question: "How much does a roof repair cost?", answer: "Cost depends on the extent of damage and materials. Small repairs are typically a few hundred dollars; we always provide a written quote before any work begins." },
        { question: "Can you repair a roof in the rain?", answer: "We can install emergency tarping during active weather and complete permanent repairs once conditions allow." },
      ],
      financingNote: "Repair costs can be financed - see our financing options for payment plans.",
      warranty: "Demo - enter your repair workmanship warranty here.",
    },
    {
      name: "Roof Replacement",
      slug: "roof-replacement",
      excerpt: "Complete tear-off and installation backed by manufacturer-certified crews.",
      description:
        "When repairs no longer make economic sense, a full replacement protects your home for decades. We perform a complete tear-off, inspect and replace damaged decking, install modern underlayment and flashing, and install your choice of asphalt, metal, tile, or flat roofing systems. As a demo company we are described as manufacturer-certified; enter your real certifications in Company Settings.",
      icon: "home",
      isFeatured: true,
      benefits: [
        "Complete tear-off and disposal",
        "Decking inspection and replacement",
        "Manufacturer-certified installation",
        "Wide selection of materials",
        "Transferable warranty options",
      ],
      process: [
        { title: "Free inspection", description: "We measure, inspect, and document the current roof condition." },
        { title: "Detailed estimate", description: "You receive a written estimate with material options and exact pricing." },
        { title: "Material selection", description: "Choose colors and products with our guidance on lifespan and value." },
        { title: "Installation", description: "Our crew protects your property, tears off the old roof, and installs the new system." },
        { title: "Final walkthrough", description: "We clean the site with a magnetic nail sweep and walk the job with you." },
      ],
      faqs: [
        { question: "How long does a roof replacement take?", answer: "Most single-family homes are completed in 1-2 days depending on size, pitch, and weather." },
        { question: "Do I need to leave my home during installation?", answer: "No. We ask that you move vehicles and fragile items; the work is exterior." },
      ],
      financingNote: "Financing available - replace your roof now and pay over time.",
      warranty: "Demo - enter your replacement warranty here.",
    },
    {
      name: "Roof Inspection",
      slug: "roofing-inspection",
      excerpt: "Detailed written inspections for real estate, maintenance, and peace of mind.",
      description:
        "Whether you are buying a home, filing an insurance claim, or simply want to know where your roof stands, our inspection gives you an honest written report with photos. We inspect shingles, flashing, vents, gutters, attic ventilation, and decking, and we tell you plainly what needs attention and what does not.",
      icon: "search",
      benefits: [
        "Written report with photos",
        "Insurance and real-estate friendly",
        "Attic ventilation review",
        "Honest, no-pressure findings",
        "Drone-assisted imaging available",
      ],
      process: [
        { title: "Schedule", description: "Book a convenient inspection window." },
        { title: "Full inspection", description: "We inspect the roof surface, flashing, vents, gutters, and attic." },
        { title: "Written report", description: "Receive a documented report with photos and recommended next steps." },
      ],
      faqs: [
        { question: "Is a roof inspection free?", answer: "We offer complimentary inspections for homeowners in our service area; please call to confirm for your address." },
      ],
    },
    {
      name: "Storm Damage",
      slug: "storm-damage-roofing",
      excerpt: "Hail, wind, and storm response with documentation for your insurance claim.",
      description:
        "North Texas storms are hard on roofs. After hail or high winds we provide a thorough damage assessment, document our findings with photos for your insurer, and coordinate directly with your adjuster. We help you understand the claims process; insurance decisions and coverage are ultimately determined by your policy and your insurer.",
      icon: "bolt",
      isFeatured: true,
      benefits: [
        "Post-storm damage assessment",
        "Photo documentation for claims",
        "Adjuster meet-ups",
        "Emergency tarping",
        "Insurance claim guidance",
      ],
      process: [
        { title: "Contact us", description: "Call right after the storm - prompt documentation helps claims." },
        { title: "Damage assessment", description: "We inspect and photograph hail strikes, wind damage, and leaks." },
        { title: "Claim support", description: "We meet your adjuster on-site and share our documentation." },
        { title: "Restoration", description: "Once approved, we repair or replace the damaged roofing." },
      ],
      faqs: [
        { question: "Will my insurance rate go up if I file a claim?", answer: "That depends on your insurer and policy. We provide documentation and facts; we cannot guarantee any coverage or rate outcome." },
      ],
    },
    {
      name: "Emergency Roofing",
      slug: "emergency-roofing",
      excerpt: "Rapid response for active leaks and storm damage across DFW.",
      description:
        "Active leak? Storm damage? We prioritize emergency calls to stop water intrusion fast - usually with same-day tarping or temporary repairs - then return to complete permanent work. Emergency availability is shown on this site only when enabled by the company administrator.",
      icon: "siren",
      benefits: [
        "Same-day response (when enabled)",
        "Emergency tarping",
        "Temporary leak repair",
        "Storm board-up",
        "Clear next-step guidance",
      ],
      process: [
        { title: "Call our emergency line", description: "Speak with a person, not a queue." },
        { title: "Rapid stabilization", description: "We tarp or seal the leak to stop further damage." },
        { title: "Permanent repair", description: "We schedule and complete the lasting fix." },
      ],
      faqs: [
        { question: "Do you offer 24/7 service?", answer: "Our emergency line is staffed as configured by the company. Current availability is shown at the top of this page and on our contact page." },
      ],
    },
    {
      name: "Commercial Roofing",
      slug: "commercial-roofing",
      excerpt: "Flat and low-slope roofing for offices, warehouses, and retail buildings.",
      description:
        "We install and maintain low-slope roofing systems for commercial buildings, including TPO, EPDM, modified bitumen, and coated systems. We work around your operating hours and provide documentation your property manager or insurer needs.",
      icon: "building",
      benefits: [
        "TPO, EPDM, and modified bitumen",
        "After-hours scheduling",
        "Preventive maintenance programs",
        "Detailed job documentation",
      ],
      process: [
        { title: "Site survey", description: "We inspect the roof, takeoffs, and access requirements." },
        { title: "Proposal", description: "You receive system options and pricing with life-cycle context." },
        { title: "Installation", description: "We complete the work on schedule with minimal disruption." },
        { title: "Maintenance plan", description: "Optional scheduled maintenance extends service life." },
      ],
      faqs: [
        { question: "Do you work on occupied buildings?", answer: "Yes. We coordinate with tenants and schedule around business hours." },
      ],
    },
    {
      name: "Roof Maintenance",
      slug: "roof-maintenance",
      excerpt: "Scheduled care that extends roof life and prevents surprise leaks.",
      description:
        "Routine maintenance is the cheapest insurance against premature replacement. Our maintenance program includes debris removal, gutter clearing, flashing and seal checks, vent boot replacement, and a written condition report each visit.",
      icon: "calendar",
      benefits: [
        "Debris and gutter clearing",
        "Flashing and seal inspection",
        "Vent boot replacement",
        "Annual written report",
      ],
      process: [
        { title: "Schedule visit", description: "Annual or semi-annual visits, timed before storm season." },
        { title: "Maintenance work", description: "We clear, seal, and service wear components." },
        { title: "Condition report", description: "You receive photos and notes on remaining service life." },
      ],
      faqs: [
        { question: "How often should a roof be maintained?", answer: "Most homes benefit from annual service; heavy tree cover or low-slope roofs may need twice-yearly visits." },
      ],
    },
    {
      name: "Gutters",
      slug: "gutters",
      excerpt: "Seamless gutter installation, repair, and protection systems.",
      description:
        "Gutters protect your roof, fascia, and foundation. We install seamless aluminum and steel gutters, repair sagging or leaking runs, and add guard systems to keep out debris.",
      icon: "droplet",
      benefits: [
        "Seamless installation",
        "Gutter guard options",
        "Downspout extensions",
        "Fascia repair",
      ],
      process: [
        { title: "Measurement", description: "We measure runs and choose sizes for your roof area." },
        { title: "Installation", description: "Seamless gutters are formed on site and hung correctly." },
        { title: "Protection", description: "Optional guards reduce cleaning for years." },
      ],
      faqs: [
        { question: "Do you install gutter guards?", answer: "Yes, we offer several guard systems and can advise on the right fit for your trees and roof." },
      ],
    },
    // --- Roofing materials (kind = MATERIAL)
    {
      name: "Asphalt Shingles",
      slug: "asphalt-shingles",
      kind: "MATERIAL",
      excerpt: "The most popular residential roofing - affordable, reliable, and attractive.",
      description:
        "Architectural asphalt shingles offer an excellent balance of cost, lifespan, and curb appeal. Most products carry manufacturer wind and algae resistance ratings; choose from a wide palette of colors.",
      icon: "layer",
      benefits: ["Cost-effective", "Wide color selection", "Good wind resistance", "Readily available"],
      process: [],
      faqs: [
        { question: "How long do asphalt shingles last?", answer: "Architectural shingles typically carry manufacturer ratings in the 25-50 year range; actual life depends on installation quality, ventilation, and weather exposure." },
      ],
    },
    {
      name: "Metal Roofing",
      slug: "metal-roofing",
      kind: "MATERIAL",
      excerpt: "Long-lived, energy-efficient, and exceptionally durable in severe weather.",
      description:
        "Standing seam and corrugated metal roofing deliver decades of service, reflect solar heat, and shed hail and wind better than most materials. Higher upfront cost is offset by long life and low maintenance.",
      icon: "metal",
      benefits: ["Exceptional durability", "Energy efficient", "Low maintenance", "Fire resistant"],
      process: [],
      faqs: [
        { question: "Is a metal roof noisy in the rain?", answer: "Properly installed metal roofing with solid decking and underlayment is no louder than other roof types inside the home." },
      ],
    },
    {
      name: "Tile Roofing",
      slug: "tile-roofing",
      kind: "MATERIAL",
      excerpt: "Timeless beauty and remarkable longevity for the right structure.",
      description:
        "Concrete and clay tile provide a distinctive look and can outlast most other materials. Tile is heavy - homes may need structural evaluation before installation.",
      icon: "grid",
      benefits: ["Very long service life", "Distinctive appearance", "Fire and insect resistant", "Thermal mass"],
      process: [],
      faqs: [
        { question: "Can my home support a tile roof?", answer: "Tile is heavy and requires a structural evaluation; we can assess this during inspection." },
      ],
    },
    {
      name: "Flat Roofing / TPO & EPDM",
      slug: "flat-roofing",
      kind: "MATERIAL",
      excerpt: "Low-slope systems for additions, garages, and commercial buildings.",
      description:
        "TPO and EPDM membranes are the standard for flat and low-slope roofs, offering heat-welded or glued seams and strong UV performance. We install, repair, and coat these systems.",
      icon: "square",
      benefits: ["Heat-welded seams", "UV resistant", "Suitable for low slope", "Cost-effective per square"],
      process: [],
      faqs: [
        { question: "How long do TPO and EPDM roofs last?", answer: "Manufacturer ratings commonly range from 20 to 30+ years with proper installation and maintenance." },
      ],
    },
  ];

  const serviceRecords: Record<string, { id: string }> = {};
  for (const s of services) {
    const rec = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        kind: s.kind ?? "SERVICE",
        excerpt: s.excerpt,
        description: s.description,
        icon: s.icon,
        isFeatured: s.isFeatured ?? false,
        benefits: s.benefits,
        process: s.process,
        faqs: s.faqs,
        warranty: s.warranty,
        financingNote: s.financingNote,
        ctaLabel: s.kind === "MATERIAL" ? "Request a Material Consultation" : "Get a Free Estimate",
      },
    });
    serviceRecords[s.slug] = rec;
  }
  console.log(`  services: ${services.length}`);

  // ------------------------------------------------------------ locations
  const locations = [
    {
      city: "Dallas", state: "TX", zipCodes: "75201, 75204, 75205, 75206, 75214, 75219, 75225, 75230",
      excerpt: "Roofing services in Dallas from historic East Dallas to North Dallas.",
      description:
        "Our Dallas team serves neighborhoods across the city, from Oak Cliff and East Dallas to Preston Hollow and North Dallas. We work with the area's mix of mid-century homes, new construction, and historic properties, and we understand how North Texas weather - spring hail, summer heat, and sudden windstorms - affects local roofs.",
      addressLine1: "1400 Commerce Street, Suite 300",
      phone: "(214) 555-0188",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 32.7767, longitude: -96.797,
    },
    {
      city: "Fort Worth", state: "TX", zipCodes: "76102, 76107, 76109, 76110, 76112, 76116, 76120, 76133",
      excerpt: "Roof repair and replacement for Fort Worth and Tarrant County.",
      description:
        "Fort Worth homeowners trust us for honest assessments and durable installations. From the near-west side to Keller and South Fort Worth, we handle the region's clay soils and shifting foundations that can stress roofing systems over time.",
      phone: "(817) 555-0144",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 32.7555, longitude: -97.3308,
    },
    {
      city: "Plano", state: "TX", zipCodes: "75023, 75024, 75025, 75074, 75075, 75093",
      excerpt: "Plano roofing services for homes and small commercial buildings.",
      description:
        "Plano's mix of established 1980s-90s neighborhoods and newer builds means a wide range of roofing conditions. We help Plano homeowners plan for replacement at the right time rather than reacting to leaks.",
      phone: "(972) 555-0162",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 33.0198, longitude: -96.6989,
    },
    {
      city: "Frisco", state: "TX", zipCodes: "75033, 75034, 75035, 75036, 75068",
      excerpt: "Fast-growing Frisco roofing - inspections, repair, and replacement.",
      description:
        "Frisco's rapid growth has added thousands of roofs that are now reaching the age where maintenance matters. We provide inspections and proactive care to protect these investments.",
      phone: "(972) 555-0177",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 33.1507, longitude: -96.8236,
    },
    {
      city: "Arlington", state: "TX", zipCodes: "76001, 76002, 76006, 76010, 76011, 76012, 76013, 76015",
      excerpt: "Arlington roofing services between Dallas and Fort Worth.",
      description:
        "Arlington sees its share of severe weather crossing the metroplex. We provide storm assessments and full roofing services to Arlington homeowners and small businesses.",
      phone: "(817) 555-0133",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 32.7357, longitude: -97.1081,
    },
    {
      city: "McKinney", state: "TX", zipCodes: "75069, 75070, 75071, 75072",
      excerpt: "McKinney roofing - historic homes and new construction.",
      description:
        "McKinney's historic square area and surrounding new developments give us a unique mix of roofing challenges. We tailor repair and replacement plans to each home's age and construction.",
      phone: "(972) 555-0155",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 33.2148, longitude: -96.6219,
    },
    {
      city: "Irving", state: "TX", zipCodes: "75038, 75039, 75060, 75061, 75062, 75063",
      excerpt: "Irving roofing services for homes and commercial properties.",
      description:
        "Irving's central location and varied housing stock keep our crews busy with everything from modest starter homes to large custom properties near Las Colinas.",
      phone: "(972) 555-0166",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 32.814, longitude: -96.9489,
    },
    {
      city: "Richardson", state: "TX", zipCodes: "75080, 75081, 75082, 75083, 75085",
      excerpt: "Richardson roofing inspections, repairs, and replacements.",
      description:
        "Many Richardson homes were built in the same era and are reaching replacement age together. We help residents compare repair versus replacement with clear numbers.",
      phone: "(972) 555-0171",
      businessHours: "Mon-Fri 7:30am - 6:00pm | Sat 8:00am - 2:00pm",
      latitude: 32.9483, longitude: -96.7299,
    },
  ];

  const locationRecords: Record<string, { id: string }> = {};
  for (const l of locations) {
    const rec = await prisma.location.upsert({
      where: { slug: slugify(l.city) },
      update: {},
      create: {
        city: l.city,
        state: l.state,
        slug: slugify(l.city),
        zipCodes: l.zipCodes,
        excerpt: l.excerpt,
        description: l.description,
        addressLine1: l.addressLine1 ?? null,
        phone: l.phone,
        businessHours: l.businessHours,
        latitude: l.latitude,
        longitude: l.longitude,
      },
    });
    locationRecords[l.city] = rec;
  }
  // Link services <-> locations
  for (const [city, rec] of Object.entries(locationRecords)) {
    await prisma.location.update({
      where: { id: rec.id },
      data: {
        services: { connect: Object.values(serviceRecords).filter((s) => s.id).map((s) => ({ id: s.id })) },
      },
    });
  }
  console.log(`  locations: ${locations.length}`);

  // -------------------------------------------------------------- projects
  const projects = [
    { title: "Hail-Damaged Roof Replacement in North Dallas", city: "Dallas", service: "roof-replacement", roofType: "Architectural Asphalt", materialsUsed: "Architectural shingles, synthetic underlayment, ice & water shield", date: "2025-05-14", size: "32 squares", desc: "After a spring hailstorm, this 1998 two-story required a full tear-off. We replaced damaged decking, upgraded ventilation, and installed architectural shingles matched to the neighborhood.", isBeforeAfter: true, featured: true },
    { title: "Storm Damage Restoration in Fort Worth", city: "Fort Worth", service: "storm-damage-roofing", roofType: "Architectural Asphalt", materialsUsed: "Shingles, new flashing, drip edge", date: "2025-04-02", size: "28 squares", desc: "Wind lifted several shingle rows and damaged flashing around the chimney. We documented the damage for the homeowner's insurer and completed a full restoration.", isBeforeAfter: true, featured: true },
    { title: "Metal Roof Installation in Plano", city: "Plano", service: "roof-replacement", roofType: "Standing Seam Metal", materialsUsed: "Standing seam panels, clips, high-temp underlayment", date: "2025-03-18", size: "24 squares", desc: "The owners wanted a lifetime-grade roof that could shed hail. We installed a standing seam metal system with proper attic ventilation upgrades.", isBeforeAfter: true, featured: true },
    { title: "Leak Repair and Skylight Sealing in Frisco", city: "Frisco", service: "roof-repair", roofType: "Asphalt Shingle", materialsUsed: "Shingles, step flashing, skylight curb sealant", date: "2025-06-09", size: "Repair", desc: "A persistent ceiling stain traced to a leaking skylight curb. We replaced the surrounding shingles and reflashed the curb.", isBeforeAfter: true },
    { title: "TPO Flat Roof for Commercial Building in Irving", city: "Irving", service: "commercial-roofing", roofType: "TPO Membrane", materialsUsed: "TPO membrane, insulation cover board, walkway pads", date: "2025-02-21", size: "90 squares", desc: "Aging built-up roof replaced with a mechanically attached TPO system, completed over a weekend to avoid business disruption.", isBeforeAfter: true, featured: true },
    { title: "Tile Roof Repair in Arlington", city: "Arlington", service: "roof-repair", roofType: "Concrete Tile", materialsUsed: "Concrete tiles, underlayment patch, ridge seal", date: "2025-07-11", size: "Repair", desc: "Cracked tiles and failed underlayment in one valley. We matched replacement tiles and sealed the valley flashing.", isBeforeAfter: true },
    { title: "Full Replacement in McKinney", city: "McKinney", service: "roof-replacement", roofType: "Designer Asphalt", materialsUsed: "Designer shingles, ridge vent, drip edge", date: "2025-08-04", size: "35 squares", desc: "End-of-life roof replaced with designer shingles and improved intake ventilation to reduce summer attic heat.", isBeforeAfter: true },
    { title: "Gutter and Guard Installation in Richardson", city: "Richardson", service: "gutters", roofType: "Aluminum Gutters", materialsUsed: "6\" seamless aluminum, hidden hangers, mesh guards", date: "2025-09-02", size: "210 linear feet", desc: "Oversized seamless gutters with guards to handle a heavy tree canopy and protect the foundation.", isBeforeAfter: false },
  ];

  for (const p of projects) {
    const slug = slugify(p.title);
    await prisma.project.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title,
        slug,
        serviceId: serviceRecords[p.service]?.id ?? null,
        locationId: locationRecords[p.city]?.id ?? null,
        roofType: p.roofType,
        materialsUsed: p.materialsUsed,
        projectDate: new Date(p.date),
        projectSize: p.size,
        description: p.desc,
        isFeatured: p.featured ?? false,
        isBeforeAfter: p.isBeforeAfter,
      },
    });
  }
  console.log(`  projects: ${projects.length}`);

  // Attach real roofing images to projects
  const ROOF_PHOTOS = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=800&fit=crop&crop=center",
  ];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const slug = slugify(p.title);
    const featuredUrl = ROOF_PHOTOS[i % ROOF_PHOTOS.length];
    const beforeUrl = ROOF_PHOTOS[(i + 2) % ROOF_PHOTOS.length];
    const afterUrl = ROOF_PHOTOS[(i + 4) % ROOF_PHOTOS.length];

    const featuredMedia = await prisma.media.upsert({
      where: { id: `project-featured-${slug}` },
      update: { url: featuredUrl },
      create: {
        id: `project-featured-${slug}`,
        filename: `project-${slug}-featured.jpg`,
        originalName: `project-${slug}-featured.jpg`,
        mimeType: "image/jpeg",
        size: 0,
        type: "IMAGE",
        url: featuredUrl,
        altText: p.title,
        folder: "projects",
      } as unknown as never,
    });
    const beforeMedia = await prisma.media.upsert({
      where: { id: `project-before-${slug}` },
      update: { url: beforeUrl },
      create: {
        id: `project-before-${slug}`,
        filename: `project-${slug}-before.jpg`,
        originalName: `project-${slug}-before.jpg`,
        mimeType: "image/jpeg",
        size: 0,
        type: "IMAGE",
        url: beforeUrl,
        altText: `${p.title} — before`,
        folder: "projects",
      } as unknown as never,
    });
    const afterMedia = await prisma.media.upsert({
      where: { id: `project-after-${slug}` },
      update: { url: afterUrl },
      create: {
        id: `project-after-${slug}`,
        filename: `project-${slug}-after.jpg`,
        originalName: `project-${slug}-after.jpg`,
        mimeType: "image/jpeg",
        size: 0,
        type: "IMAGE",
        url: afterUrl,
        altText: `${p.title} — after`,
        folder: "projects",
      } as unknown as never,
    });

    await prisma.project.update({
      where: { slug },
      data: {
        featuredImageId: featuredMedia.id,
        beforeImageId: beforeMedia.id,
        afterImageId: afterMedia.id,
      },
    });
  }
  console.log(`  project images: ${projects.length} × 3`);

  // --------------------------------------------------------------- reviews
  const reviews = [
    { name: "Maria G.", rating: 5, service: "roof-replacement", city: "Dallas", text: "The crew was professional from estimate to cleanup. They found damaged decking and fixed it without inflating the price. Highly recommend.", source: "GOOGLE", days: 12, featured: true },
    { name: "James T.", rating: 5, service: "storm-damage-roofing", city: "Fort Worth", text: "After the hailstorm they documented everything and met my adjuster on site. The whole claim process was far less stressful than I expected.", source: "GOOGLE", days: 26, featured: true },
    { name: "Priya N.", rating: 5, service: "roof-repair", city: "Frisco", text: "I had a ceiling stain for months. They found the actual leak in twenty minutes and fixed it properly. No upselling, just honest work.", source: "GOOGLE", days: 5 },
    { name: "Robert W.", rating: 5, service: "commercial-roofing", city: "Irving", text: "They re-roofed our building over a weekend with zero disruption to operations. Clean site, good communication throughout.", source: "OTHER", days: 40, featured: true },
    { name: "Candace B.", rating: 4, service: "roofing-inspection", city: "Plano", text: "Detailed report with photos, and they told me my roof still had years of life left instead of pushing a replacement. I appreciate the honesty.", source: "GOOGLE", days: 18 },
    { name: "Diego R.", rating: 5, service: "roof-maintenance", city: "Arlington", text: "The maintenance visit caught a failing vent boot before it leaked into my attic. Worth every penny.", source: "FACEBOOK", days: 33 },
    { name: "Susan K.", rating: 5, service: "gutters", city: "Richardson", text: "New seamless gutters look great and no more overflowing in the back corner of the yard.", source: "WEBSITE", days: 50 },
    { name: "Ahmed S.", rating: 5, service: "emergency-roofing", city: "McKinney", text: "Called during a storm with an active leak. They had it tarped within hours and completed the permanent repair the next week.", source: "GOOGLE", days: 8, featured: true },
  ];
  for (const r of reviews) {
    const reviewedAt = new Date();
    reviewedAt.setDate(reviewedAt.getDate() - r.days);
    await prisma.review.create({
      data: {
        customerName: r.name,
        rating: r.rating,
        text: r.text,
        serviceId: serviceRecords[r.service]?.id ?? null,
        locationId: locationRecords[r.city]?.id ?? null,
        source: r.source as any,
        reviewedAt,
        isFeatured: r.featured ?? false,
        isVerified: true,
      },
    });
  }
  console.log(`  reviews: ${reviews.length}`);

  // ------------------------------------------------------------------ team
  const team = [
    { name: "Daniel Reyes", position: "Founder & President", bio: "Founded the company after two decades in residential and commercial roofing. Oversees quality standards and customer experience." },
    { name: "Karen Whitfield", position: "Operations Manager", bio: "Schedules crews, manages safety compliance, and ensures every job finishes on time and clean." },
    { name: "Marcus Bell", position: "Production Foreman", bio: "Runs installation crews with an emphasis on flashing detail and jobsite safety." },
    { name: "Elena Vasquez", position: "Customer Care Lead", bio: "Your first point of contact for questions, scheduling, and after-job support." },
  ];
  for (const t of team) {
    await prisma.teamMember.create({
      data: { name: t.name, position: t.position, bio: t.bio, isFeatured: true },
    });
  }
  console.log(`  team: ${team.length}`);

  // ------------------------------------------------------------------ faqs
  const faqs = [
    { q: "How do I know if I need a repair or a full replacement?", a: "An inspection answers this. If damage is localized and the roof is mid-life, a repair is usually right. If shingles are failing across the surface or the roof is past its service life, replacement is often more economical. We give you both numbers so you can decide.", cat: "General", featured: true },
    { q: "Are you licensed and insured?", a: "We maintain licensing and insurance as required in our service areas. Current details are listed on our About page and in Company Settings; verify the specifics that apply to your project before signing a contract." },
    { q: "Do you offer financing?", a: "Yes, we offer financing options for qualified projects. See our Financing page for current plans and how to apply." },
    { q: "How long does a roof replacement take?", a: "Most single-family homes are completed in one to two days, weather permitting. Larger or steeper roofs and commercial jobs take longer; your written estimate includes a schedule." },
    { q: "What happens if it rains during my project?", a: "We monitor the forecast and stage work so the roof is always weather-tight overnight. If weather interrupts the job, we secure the site and resume as soon as conditions allow." },
    { q: "Do you clean up after the job?", a: "Yes. Debris is hauled away and we perform a magnetic nail sweep of the lawn and driveway before the final walkthrough." },
    { q: "What warranty do you provide?", a: "Material warranties come from the manufacturer; we also stand behind our installation with a workmanship warranty. Exact terms are provided in writing with your estimate." },
    { q: "Will you work with my insurance company?", a: "For storm claims we provide photo documentation and meet your adjuster on site. Coverage decisions are made by your insurer under your policy." },
  ];
  for (const f of faqs) {
    await prisma.faq.create({
      data: { question: f.q, answer: f.a, category: f.cat ?? "General", isFeatured: f.featured ?? false },
    });
  }
  console.log(`  faqs: ${faqs.length}`);

  // ---------------------------------------------------------------- offers
  await prisma.offer.create({
    data: {
      title: "Free Roof Inspection for New Customers",
      description: "New customers in our service areas receive a complimentary written roof inspection with photos - no obligation.",
      ctaLabel: "Request Inspection",
      ctaLink: "/free-estimate/",
      isFeatured: true,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      terms: "Demo offer. Limit one per household. Subject to service area and scheduling availability.",
    },
  });
  await prisma.offer.create({
    data: {
      title: "Storm Season Preparedness Check",
      description: "Schedule a maintenance visit before storm season and receive a written condition report with your service.",
      ctaLabel: "Schedule Maintenance",
      ctaLink: "/roof-maintenance/",
      isFeatured: false,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      terms: "Demo offer. Subject to scheduling availability.",
    },
  });
  console.log("  offers: 2");

  // Note: financing was removed from the platform (no Financing page or admin
  // module). The financing_options table remains for backward compatibility.

  // --------------------------------------------------------------- forms
  const estimateForm = await prisma.form.upsert({
    where: { slug: "free-estimate" },
    update: {},
    create: {
      name: "Free Estimate",
      slug: "free-estimate",
      description: "Primary lead capture form shown on the Free Estimate page and CTAs.",
      submitLabel: "Get My Free Estimate",
      successMessage: "Thank you! We've received your request and will call you shortly.",
      notifyEmails: "hello@lonestarroofingdemo.test",
      createLead: true,
      leadSource: "FREE_ESTIMATE",
      spamProtection: true,
      uploadAllowed: true,
      redirectUrl: "/free-estimate/?submitted=1",
    },
  });
  const fields: {
    name: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    width: string;
    order: number;
    options?: string[];
  }[] = [
    { name: "firstName", label: "First Name", type: "TEXT", required: true, width: "half", order: 1 },
    { name: "lastName", label: "Last Name", type: "TEXT", required: true, width: "half", order: 2 },
    { name: "phone", label: "Phone", type: "PHONE", required: true, width: "half", order: 3 },
    { name: "email", label: "Email", type: "EMAIL", required: true, width: "half", order: 4 },
    { name: "zipCode", label: "ZIP Code", type: "TEXT", required: true, width: "half", order: 5 },
    { name: "city", label: "City", type: "TEXT", required: false, width: "half", order: 6 },
    { name: "serviceId", label: "Service Needed", type: "SELECT", required: true, width: "half", order: 7, options: services.filter((s) => s.kind !== "MATERIAL").map((s) => s.name) },
    { name: "propertyType", label: "Property Type", type: "SELECT", required: false, width: "half", order: 8, options: ["Residential", "Commercial", "Multi-family"] },
    { name: "roofType", label: "Roof Type", type: "SELECT", required: false, width: "half", order: 9, options: ["Asphalt Shingles", "Metal", "Tile", "Flat / Low-slope", "Not sure"] },
    { name: "message", label: "Tell us about your project", type: "TEXTAREA", required: false, width: "full", order: 10 },
    { name: "preferredContact", label: "Preferred Contact Method", type: "SELECT", required: false, width: "half", order: 11, options: ["Phone call", "Text message", "Email"] },
    { name: "appointmentDate", label: "Preferred Appointment Date", type: "DATE", required: false, width: "half", order: 12 },
  ];
  for (const f of fields) {
    await prisma.formField.upsert({
      where: { formId_name: { formId: estimateForm.id, name: f.name } },
      update: {},
      create: { formId: estimateForm.id, ...f },
    });
  }
  // Contact form
  await prisma.form.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      name: "Contact Us",
      slug: "contact",
      submitLabel: "Send Message",
      successMessage: "Thanks for reaching out - we'll reply within one business day.",
      createLead: true,
      leadSource: "CONTACT_FORM",
      spamProtection: true,
      fields: {
        create: [
          { name: "firstName", label: "Name", type: "TEXT", required: true, width: "half", order: 1 },
          { name: "email", label: "Email", type: "EMAIL", required: true, width: "half", order: 2 },
          { name: "message", label: "Message", type: "TEXTAREA", required: true, width: "full", order: 3 },
        ],
      },
    },
  });
  console.log("  forms: free-estimate, contact");

  // ---------------------------------------------------------------- menus
  const headerItems = [
    { label: "Services", url: "/roofing-services/", order: 1 },
    { label: "Projects", url: "/projects/", order: 2 },
    { label: "Service Areas", url: "/service-areas/", order: 3 },
    { label: "About", url: "/about/", order: 4 },
    { label: "Reviews", url: "/reviews/", order: 5 },
    { label: "Blog", url: "/blog/", order: 6 },
    { label: "Contact", url: "/contact/", order: 7 },
  ];
  for (const slug of ["header", "footer", "mobile"]) {
    const existing = await prisma.menu.findUnique({ where: { slug }, select: { id: true } });
    if (existing) await prisma.menuItem.deleteMany({ where: { menuId: existing.id } });
  }
  const headerMenu = await prisma.menu.upsert({
    where: { slug: "header" },
    update: {},
    create: { name: "Header", slug: "header" },
  });
  for (const i of headerItems) {
    await prisma.menuItem.create({
      data: { menuId: headerMenu.id, label: i.label, url: i.url, order: i.order },
    });
  }
  const footerMenu = await prisma.menu.upsert({
    where: { slug: "footer" },
    update: {},
    create: { name: "Footer", slug: "footer" },
  });
  for (const i of headerItems) {
    await prisma.menuItem.create({
      data: { menuId: footerMenu.id, label: i.label, url: i.url, order: i.order },
    });
  }
  const mobileMenu = await prisma.menu.upsert({
    where: { slug: "mobile" },
    update: {},
    create: { name: "Mobile", slug: "mobile" },
  });
  const mobileItems: { label: string; url: string; order: number; isCTA: boolean }[] = [
    { label: "Call Now", url: "tel:+12145550188", order: 1, isCTA: true },
    { label: "Get Free Estimate", url: "/free-estimate/", order: 2, isCTA: true },
    ...headerItems.map((i, idx) => ({ label: i.label, url: i.url, order: idx + 3, isCTA: false })),
  ];
  for (const i of mobileItems) {
    await prisma.menuItem.create({
      data: { menuId: mobileMenu.id, label: i.label, url: i.url, order: i.order, isCTA: i.isCTA ?? false },
    });
  }
  console.log("  menus: header, footer, mobile");

  // ------------------------------------------------------------------ blog
  const category = await prisma.blogCategory.upsert({
    where: { slug: "roofing-tips" },
    update: {},
    create: { name: "Roofing Tips", slug: "roofing-tips" },
  });
  const costCategory = await prisma.blogCategory.upsert({
    where: { slug: "cost-guides" },
    update: {},
    create: { name: "Cost Guides", slug: "cost-guides" },
  });

  const posts = [
    {
      title: "How Much Does a Roof Replacement Cost in Dallas-Fort Worth?",
      slug: "how-much-does-a-roof-replacement-cost",
      excerpt: "A practical guide to the factors that drive roof replacement cost, and how to compare quotes fairly.",
      category: costCategory.id,
      content: `Replacing a roof is one of the largest investments a homeowner makes, so it pays to understand what drives the price.

## What drives the cost

**Size.** Roofing is priced by the "square" (100 square feet). A larger roof means more material, labor, and disposal.

**Pitch and complexity.** Steeper roofs and roofs with many valleys, hips, dormers, or skylights take more time and skill to waterproof.

**Material.** Architectural asphalt is the most affordable; metal, tile, and designer systems cost more but last longer.

**Decking.** Rotted or soft decking discovered during tear-off is replaced at a per-sheet rate.

**Access.** Homes that are hard to reach or require special equipment add labor time.

## How to compare quotes

Compare like with like: the same manufacturer and product line, the same underlayment and flashing scope, the same ventilation work, and the same warranty terms. The lowest number is not always the best value.

## Getting started

Every replacement begins with a written inspection report and an itemized estimate. There is no charge for the visit, and you will know the exact price before any work begins.`,
    },
    {
      title: "When Should You Replace Your Roof?",
      slug: "when-should-you-replace-your-roof",
      excerpt: "Seven signs that it may be time to stop repairing and start planning a replacement.",
      category: category.id,
      content: `Repairs add up. Here is how to tell when replacement is the smarter long-term call.

## The signs

1. **Age.** If your roof is past the manufacturer's rated service life, plan rather than react.
2. **Widespread granule loss.** Bald patches in the shingles mean the protective layer is gone.
3. **Repeated leaks.** A second leak in a different area signals systemic failure.
4. **Sagging.** Visible dips need immediate professional evaluation.
5. **Daylight in the attic.** If you can see sky, water can get in.
6. **Curling or buckling shingles.** Often a sign of heat and ventilation stress.
7. **Neighbors are replacing.** Homes built at the same time often fail together.

## What to do next

An inspection gives you a written condition report. If replacement makes sense, we provide material options and financing - and we will tell you plainly if a repair will buy you a few more years.`,
    },
  ];
  const BLOG_PHOTOS = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop&crop=center",
  ];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const blogUrl = BLOG_PHOTOS[i % BLOG_PHOTOS.length];
    const blogMedia = await prisma.media.upsert({
      where: { id: `blog-featured-${p.slug}` },
      update: { url: blogUrl },
      create: {
        id: `blog-featured-${p.slug}`,
        filename: `blog-${p.slug}.jpg`,
        originalName: `blog-${p.slug}.jpg`,
        mimeType: "image/jpeg",
        size: 0,
        type: "IMAGE",
        url: blogUrl,
        altText: p.title,
        folder: "blog",
      } as unknown as never,
    });
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { featuredImageId: blogMedia.id },
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        authorId: editor.id,
        categoryId: p.category,
        status: "PUBLISHED",
        publishedAt: new Date(),
        readingMinutes: 6,
        isFeatured: true,
        featuredImageId: blogMedia.id,
      },
    });
  }
  console.log(`  blog posts: ${posts.length}`);

  // --------------------------------------------------------------- pages
  const legalPages = [
    { title: "Privacy Policy", slug: "privacy-policy", template: "legal", content: "This is placeholder legal text for demonstration only. Replace it with a privacy policy reviewed by qualified counsel before publishing." },
    { title: "Terms of Service", slug: "terms", template: "legal", content: "This is placeholder legal text for demonstration only. Replace it with terms of service reviewed by qualified counsel before publishing." },
    { title: "Cookie Policy", slug: "cookie-policy", template: "legal", content: "This is placeholder legal text for demonstration only. Replace it with a cookie policy reviewed by qualified counsel before publishing." },
  ];
  for (const pg of legalPages) {
    await prisma.page.upsert({
      where: { slug: pg.slug },
      update: {},
      create: {
        title: pg.title,
        slug: pg.slug,
        template: pg.template,
        content: pg.content,
        status: "PUBLISHED",
        publishedAt: new Date(),
        isIndexed: false,
      },
    });
  }
  console.log(`  legal pages: ${legalPages.length}`);

  // Sample leads so the CRM has something to show
  const sampleLeads = [
    { first: "Theresa", last: "Nakamura", service: "roof-replacement", city: "Dallas", zip: "75214", status: "NEW", days: 1, message: "Interested in a replacement estimate." },
    { first: "Owen", last: "Patterson", service: "storm-damage-roofing", city: "Fort Worth", zip: "76110", status: "CONTACTED", days: 3, message: "Hail damage last week, need documentation." },
    { first: "Grace", last: "Lindqvist", service: "roof-repair", city: "Plano", zip: "75093", status: "INSPECTION_SCHEDULED", days: 6, message: "Small ceiling stain near the hallway bath." },
    { first: "Marcus", last: "Oyelaran", service: "commercial-roofing", city: "Irving", zip: "75062", status: "ESTIMATE_SENT", days: 9, message: "Flat roof on a small office building." },
    { first: "Rita", last: "Fontaine", service: "roof-replacement", city: "Frisco", zip: "75034", status: "WON", days: 21, message: "Accepted designer shingle proposal." },
    { first: "Dale", last: "Huckabee", service: "gutters", city: "Richardson", zip: "75081", status: "LOST", days: 30, message: "Went with another contractor." },
  ];
  for (const l of sampleLeads) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - l.days);
    await prisma.lead.create({
      data: {
        firstName: l.first,
        lastName: l.last,
        phone: "(214) 555-01" + String(10 + l.days).padStart(2, "0"),
        email: `${l.first.toLowerCase()}.${l.last.toLowerCase()}@example.test`,
        city: l.city,
        zipCode: l.zip,
        serviceId: serviceRecords[l.service]?.id ?? null,
        message: l.message,
        source: "FREE_ESTIMATE",
        status: l.status as any,
        createdAt,
      },
    });
  }
  console.log(`  sample leads: ${sampleLeads.length}`);

  console.log("\nDone. Demo admin login:");
  console.log("  email:    admin@roofingdemo.test");
  console.log("  password: admin123");
  console.log("\nRemember: all content is DEMO and must be replaced before launch.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
