/**
 * Admin entity configuration.
 *
 * Every CMS module is described here as a set of structured fields. The admin
 * form renderer turns these definitions into inputs, and the generic CRUD
 * action persists only the allowlisted fields. This keeps the admin codebase
 * small while every field remains explicitly declared (no freeform editing,
 * and deliberately NOT a visual page builder).
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "color"
  | "date"
  | "list" // textarea, one item per line -> string[]
  | "pipeList"; // textarea, "A | B" per line -> {a,b}[]

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
  placeholder?: string;
  half?: boolean;
  /** For pipeList: the two JSON keys produced from each "A | B" line. */
  keys?: [string, string];
  /** For pipeList: human labels shown in the help text. */
  keyLabels?: [string, string];
};

export type EntityDef = {
  /** Prisma delegate name, e.g. "service". */
  model: string;
  label: string;
  pluralLabel: string;
  basePath: string;
  fields: FieldDef[];
  /** Fields to show in the list table. */
  listColumns: { key: string; label: string }[];
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

const SEO_FIELDS: FieldDef[] = [
  { name: "seoTitle", label: "SEO Title", type: "text", half: true, helpText: "Shown in search results and browser tabs." },
  { name: "seoDescription", label: "Meta Description", type: "textarea", half: true, helpText: "160 characters or fewer." },
  { name: "isIndexed", label: "Allow search engines to index", type: "checkbox", helpText: "Uncheck to hide this page from Google." },
];

export const ENTITIES: Record<string, EntityDef> = {
  service: {
    model: "service",
    label: "Service",
    pluralLabel: "Services",
    basePath: "/admin/services/",
    orderBy: "order",
    orderDir: "asc",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "slug", label: "URL Slug", type: "text", required: true, half: true, placeholder: "roof-repair", helpText: "The page URL, e.g. /roof-repair/" },
      { name: "kind", label: "Type", type: "select", half: true, options: [{ value: "SERVICE", label: "Service" }, { value: "MATERIAL", label: "Roofing Material" }], helpText: "Materials appear in the materials section." },
      { name: "icon", label: "Icon", type: "text", half: true, placeholder: "wrench", helpText: "Icon name: wrench, home, search, bolt, siren, building, calendar, droplet, layer, metal, grid, square" },
      { name: "excerpt", label: "Short Description", type: "textarea", half: true, helpText: "Shown on cards and lists." },
      { name: "description", label: "Full Description", type: "textarea", helpText: "Shown on the detail page." },
      { name: "benefits", label: "Benefits", type: "list", helpText: "One benefit per line." },
      { name: "process", label: "Process Steps", type: "pipeList", keys: ["title", "description"], keyLabels: ["Step title", "Step description"], helpText: "One step per line as: Title | Description" },
      { name: "faqs", label: "FAQs", type: "pipeList", keys: ["question", "answer"], keyLabels: ["Question", "Answer"], helpText: "One FAQ per line as: Question | Answer" },
      { name: "warranty", label: "Warranty", type: "textarea", half: true },
      { name: "ctaLabel", label: "Call to Action Label", type: "text", half: true, placeholder: "Get a Free Estimate" },
      { name: "order", label: "Display Order", type: "number", half: true, helpText: "Lower numbers appear first." },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true, helpText: "Show in featured sections." },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true, helpText: "Unpublished items are hidden from the site." },
      ...SEO_FIELDS,
    ],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "kind", label: "Type" },
      { key: "order", label: "Order" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  location: {
    model: "location",
    label: "Service Area",
    pluralLabel: "Service Areas",
    basePath: "/admin/locations/",
    orderBy: "order",
    orderDir: "asc",
    fields: [
      { name: "city", label: "City", type: "text", required: true, half: true },
      { name: "state", label: "State", type: "text", required: true, half: true, placeholder: "TX" },
      { name: "slug", label: "URL Slug", type: "text", required: true, half: true, placeholder: "dallas", helpText: "Page URL, e.g. /service-areas/dallas/" },
      { name: "phone", label: "Local Phone", type: "text", half: true, placeholder: "(214) 555-0100" },
      { name: "zipCodes", label: "ZIP Codes", type: "text", half: true, placeholder: "75201, 75204", helpText: "Comma separated." },
      { name: "addressLine1", label: "Local Address", type: "text", half: true },
      { name: "businessHours", label: "Business Hours", type: "text", half: true },
      { name: "latitude", label: "Latitude", type: "number", half: true },
      { name: "longitude", label: "Longitude", type: "number", half: true },
      { name: "mapEmbedUrl", label: "Map Embed URL", type: "text", half: true, helpText: "Optional. Leave blank to auto-generate from city/state." },
      { name: "excerpt", label: "Short Description", type: "textarea", half: true },
      { name: "description", label: "Local Content", type: "textarea", helpText: "Unique, useful local information for this city." },
      { name: "order", label: "Display Order", type: "number", half: true },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true },
      ...SEO_FIELDS,
    ],
    listColumns: [
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "phone", label: "Phone" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  project: {
    model: "project",
    label: "Project",
    pluralLabel: "Projects",
    basePath: "/admin/projects/",
    orderBy: "projectDate",
    orderDir: "desc",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL Slug", type: "text", required: true, half: true, helpText: "Page URL, e.g. /projects/your-project/" },
      { name: "roofType", label: "Roof Type", type: "text", half: true, placeholder: "Architectural Asphalt" },
      { name: "projectSize", label: "Project Size", type: "text", half: true, placeholder: "32 squares" },
      { name: "materialsUsed", label: "Materials Used", type: "text", half: true },
      { name: "projectDate", label: "Project Date", type: "date", half: true },
      { name: "isBeforeAfter", label: "Include in Before & After", type: "checkbox", half: true, helpText: "Add a before/after image pair below." },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "testimonial", label: "Customer Testimonial", type: "textarea", half: true },
      { name: "beforeImageUrl", label: "Before Image", type: "text", half: true, helpText: "Drop an image above, or paste a URL below." },
      { name: "afterImageUrl", label: "After Image", type: "text", half: true },
      { name: "featuredImageUrl", label: "Featured Image", type: "text", half: true },
      ...SEO_FIELDS,
    ],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "roofType", label: "Roof Type" },
      { key: "projectDate", label: "Date" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  review: {
    model: "review",
    label: "Review",
    pluralLabel: "Reviews",
    basePath: "/admin/reviews/",
    orderBy: "reviewedAt",
    orderDir: "desc",
    fields: [
      { name: "customerName", label: "Customer Name", type: "text", required: true, half: true },
      { name: "rating", label: "Rating (1-5)", type: "number", required: true, half: true },
      { name: "source", label: "Source", type: "select", half: true, options: [
        { value: "GOOGLE", label: "Google" },
        { value: "FACEBOOK", label: "Facebook" },
        { value: "WEBSITE", label: "Website" },
        { value: "ANGIE", label: "Angi" },
        { value: "BBB", label: "BBB" },
        { value: "OTHER", label: "Other verified source" },
      ] },
      { name: "sourceUrl", label: "Source URL", type: "text", half: true, helpText: "Link to the original review." },
      { name: "reviewedAt", label: "Review Date", type: "date", half: true },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true },
      { name: "isVerified", label: "Verified", type: "checkbox", half: true },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true },
      { name: "text", label: "Review Text", type: "textarea", required: true, helpText: "Only publish reviews you have permission to display." },
    ],
    listColumns: [
      { key: "customerName", label: "Customer" },
      { key: "rating", label: "Rating" },
      { key: "source", label: "Source" },
      { key: "reviewedAt", label: "Date" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  faq: {
    model: "faq",
    label: "FAQ",
    pluralLabel: "FAQs",
    basePath: "/admin/faqs/",
    orderBy: "order",
    orderDir: "asc",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", half: true, placeholder: "General" },
      { name: "order", label: "Display Order", type: "number", half: true },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true, helpText: "Show on the homepage." },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true },
    ],
    listColumns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "order", label: "Order" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  teamMember: {
    model: "teamMember",
    label: "Team Member",
    pluralLabel: "Team",
    basePath: "/admin/team/",
    orderBy: "order",
    orderDir: "asc",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "position", label: "Position", type: "text", required: true, half: true },
      { name: "email", label: "Email", type: "text", half: true },
      { name: "phone", label: "Phone", type: "text", half: true },
      { name: "certifications", label: "Certifications", type: "text", half: true },
      { name: "photoUrl", label: "Photo", type: "text", half: true, helpText: "Drop a photo above, or paste a URL below." },
      { name: "order", label: "Display Order", type: "number", half: true },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true },
      { name: "isEnabled", label: "Published", type: "checkbox", half: true },
      { name: "bio", label: "Biography", type: "textarea" },
    ],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "position", label: "Position" },
      { key: "order", label: "Order" },
      { key: "isEnabled", label: "Published" },
    ],
  },

  offer: {
    model: "offer",
    label: "Offer",
    pluralLabel: "Offers",
    basePath: "/admin/offers/",
    orderBy: "createdAt",
    orderDir: "desc",
    fields: [
      { name: "title", label: "Offer Title", type: "text", required: true, half: true },
      { name: "ctaLabel", label: "Button Label", type: "text", half: true, placeholder: "Request Inspection" },
      { name: "ctaLink", label: "Button Link", type: "text", half: true, placeholder: "/free-estimate/" },
      { name: "imageUrl", label: "Image", type: "text", half: true, helpText: "Drop an image above, or paste a URL below." },
      { name: "startsAt", label: "Start Date", type: "date", half: true },
      { name: "endsAt", label: "End Date", type: "date", half: true },
      { name: "isFeatured", label: "Featured", type: "checkbox", half: true },
      { name: "isEnabled", label: "Active", type: "checkbox", half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "terms", label: "Terms & Conditions", type: "textarea", half: true },
    ],
    listColumns: [
      { key: "title", label: "Offer" },
      { key: "endsAt", label: "Ends" },
      { key: "isEnabled", label: "Active" },
    ],
  },

  redirect: {
    model: "redirect",
    label: "Redirect",
    pluralLabel: "Redirects",
    basePath: "/admin/redirects/",
    orderBy: "fromUrl",
    orderDir: "asc",
    fields: [
      { name: "fromUrl", label: "Old URL", type: "text", required: true, half: true, placeholder: "/old-page/" },
      { name: "toUrl", label: "Destination URL", type: "text", required: true, half: true, placeholder: "/new-page/" },
      { name: "type", label: "Redirect Type", type: "select", half: true, options: [
        { value: "PERMANENT", label: "301 Permanent (recommended)" },
        { value: "TEMPORARY", label: "302 Temporary" },
      ] },
      { name: "isActive", label: "Active", type: "checkbox", half: true },
    ],
    listColumns: [
      { key: "fromUrl", label: "From" },
      { key: "toUrl", label: "To" },
      { key: "type", label: "Type" },
      { key: "isActive", label: "Active" },
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES);
