# Roofing Platform

A **production-ready, premium roofing company website + full admin CMS** built as a reusable system. Change company data, branding, services, locations, projects, reviews, team, offers, SEO, and tracking from the admin dashboard — no code edits required.

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma · SQLite (dev) / PostgreSQL (prod) · NextAuth v5 (credentials) · bcrypt

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env — set DATABASE_URL and AUTH_SECRET (generate a random string)

# 3. Create database + seed demo data
npm run db:setup          # prisma generate → migrate → seed

# 4. Run
npm run dev               # http://localhost:3000
npm run build && npm start # production
```

**Demo admin login (seeded):**

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | `admin@roofingdemo.test` | `admin123` | Super Admin |
| Editor | `editor@roofingdemo.test` | `editor123` | Editor |
| Sales | `sales@roofingdemo.test` | `sales123` | Sales |

> All seeded content is **fictional demo data** (company, reviews, stats, projects) and is clearly flagged in the admin. Replace it from **Admin → Company Settings** and the other CMS modules before going live.

---

## Reusability

The platform is **single-tenant-per-deploy**: one roofing company per database. A new company reuses the same codebase by changing structured data in the admin:

- **Company Settings** — name, logo, phone, address, hours, social links, announcement bar
- **Appearance** — primary/secondary/accent colors, text, surface, border, radii
- **Services & Materials** — name, slug, icon, benefits, process, FAQs, warranty, CTAs, SEO
- **Service Areas** — city, state, ZIPs, local content, map, hours, SEO
- **Projects** — before/after images, gallery, service/location links
- **Reviews, Team, FAQs, Offers, Financing, Blog, Menus, Redirects, Tracking**

Predefined page templates (no drag-and-drop builder) keep the design professionally controlled while the admin edits the content inside each template.

---

## Website (Public Site)

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, trust bar, services, projects, before/after, process, materials, storm/emergency, financing, reviews, service areas, about, FAQs, blog, final CTA |
| `/roofing-services/` | All services + materials |
| `/{service-slug}/` | Service detail (14 structured sections) |
| `/service-areas/` | All service areas |
| `/service-areas/{city}/` | City detail — local content, map, services, projects, reviews, FAQs |
| `/projects/` | Portfolio with filters (service, city, roof type) |
| `/projects/{slug}/` | Project detail — before/after slider, gallery, testimonial |
| `/before-after/` | Before/after gallery |
| `/reviews/` | All reviews with rating summary |
| `/financing/` | Financing options + disclosure |
| `/about/` | Company story, values, team |
| `/faq/` | Categorized FAQs |
| `/blog/` | Article list |
| `/blog/{slug}/` | Article detail with related posts |
| `/contact/` | Contact info, map, contact form |
| `/free-estimate/` | Free estimate form (lead capture) |
| `/{legal-slug}/` | Privacy / Terms / Cookie (CMS-managed content pages) |
| `/sitemap.xml` | Auto-generated from services, locations, projects, blog, pages |
| `/robots.txt` | Disallows `/admin/` and `/api/` |

---

## Lead Pipeline

- **Free Estimate** and **Contact** forms submit to `POST /api/leads/` → validated, spam-filtered, rate-limited → creates a `Lead` record.
- **Spam protection:** honeypot field + form-open timing (≥ 2 s) + per-IP rate limiting (10 req/min).
- **Lead statuses:** `NEW → CONTACTED → INSPECTION_SCHEDULED → ESTIMATE_SENT → WON / LOST`.
- Admin can change status, add notes, and view the full pipeline on **Dashboard** and **Admin → Leads**.

---

## Admin Dashboard (`/admin/`)

Protected by NextAuth credentials + role-based access:

| Role | Access |
|------|--------|
| **Super Admin** | Everything |
| **Administrator** | Content, settings, leads, SEO, appearance, tracking, redirects |
| **Editor** | Services, projects, reviews, FAQs, team, blog |
| **Sales** | Leads |
| **Marketing** | Blog, offers |

**Modules:**

| Area | Route |
|------|-------|
| Dashboard | `/admin/` — KPIs, lead pipeline, top services/locations, recent leads/projects/reviews |
| Leads | `/admin/leads/` + `/admin/leads/{id}/` — list, filter, status pipeline, notes, call/email |
| Services | `/admin/services/` — CRUD for services and roofing materials |
| Service Areas | `/admin/locations/` — CRUD for cities |
| Projects | `/admin/projects/` — CRUD with before/after and featured images |
| Before & After | `/admin/before-after/` — filtered view of before/after projects |
| Reviews | `/admin/reviews/` — CRUD with rating, source, verification |
| Team | `/admin/team/` — CRUD for team members |
| FAQs | `/admin/faqs/` — CRUD, categorized, reusable across pages |
| Blog | `/admin/blog/` — create/edit/delete posts, categories, publishing status |
| Offers | `/admin/offers/` — specials with date windows and CTAs |
| Financing | `/admin/financing/` — financing options |
| Company Settings | `/admin/settings/` — central business information |
| Appearance | `/admin/appearance/` — brand colors and radii |
| Menus | `/admin/menus/` — header, footer, mobile navigation |
| Media Library | `/admin/media/` — images, alt text, folders |
| Forms | `/admin/forms/` — form definitions and field counts |
| SEO | `/admin/seo/` — health checks (missing titles/descriptions, duplicates, noindex) |
| Tracking | `/admin/tracking/` — GA, GTM, Meta Pixel, verification, custom scripts |
| Redirects | `/admin/redirects/` — 301/302 rules (enforced by middleware at runtime) |
| Users | `/admin/users/` — create/edit users and roles (Super Admin only) |
| Activity Log | `/admin/activity/` — audit trail of admin actions |
| Backups | `/admin/backups/` — CSV export + JSON backup guidance |

---

## Database

Run `npx prisma studio` for a GUI, or inspect `prisma/schema.prisma` for the full model.

**Tables:** `users`, `company_settings`, `site_settings`, `services`, `locations`, `projects`, `project_images`, `reviews`, `team_members`, `faqs`, `blog_posts`, `blog_categories`, `offers`, `financing_options`, `forms`, `form_fields`, `leads`, `lead_notes`, `media`, `menus`, `menu_items`, `pages`, `seo_metadata`, `redirects`, `activity_logs`.

**Migrations:**

```bash
npm run prisma:generate   # regenerate client after schema changes
npx prisma migrate dev     # create a new migration (dev)
npx prisma migrate deploy  # apply pending migrations (prod)
```

---

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite: `file:./dev.db` · Postgres: `postgresql://user:pass@host:5432/roofing` |
| `AUTH_SECRET` | Yes | Random string for NextAuth JWT signing. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Absolute site URL for canonicals, sitemap, OG tags. |
| `AUTH_TRUST_HOST` | No | `true` in most deployments. |

### Switching to PostgreSQL (Production)

```bash
npm run db:use-postgres   # flips prisma/schema.prisma provider to postgresql
# Set DATABASE_URL to your Postgres connection string in .env
npm run prisma:generate
npx prisma migrate deploy
npm run db:seed            # or restore from a backup
```

---

## Deployment

**Vercel (recommended):**

1. Push to GitHub.
2. Import the repo in Vercel — it detects Next.js automatically.
3. Set environment variables in **Settings → Environment Variables**.
4. For Postgres, provision a database (Vercel Postgres, Neon, Supabase) and set `DATABASE_URL`.
5. Add a build command override if needed: `prisma generate && prisma migrate deploy && next build`.

**Any Node host:**

```bash
npm run build
npm start  # serves on $PORT (default 3000)
```

Ensure `DATABASE_URL` and `AUTH_SECRET` are set in the host environment.

---

## SEO & Structured Data

- Per-page `title`, `meta description`, `canonical`, `og:*`, `index/noindex` from CMS fields.
- `LocalBusiness` (RoofingContractor) + `BreadcrumbList` + `FAQPage` + `Service` structured data from factual CMS settings.
- `GET /sitemap.xml` and `GET /robots.txt` are generated from the database at request time (revalidated hourly).
- Internal linking between services, locations, projects, reviews, blog posts, and FAQs is automatic via CMS relationships.
- SEO health checks in **Admin → SEO** flag missing titles, missing descriptions, duplicate titles, and noindex pages.

---

## Security

- Credentials hashed with **bcrypt**; sessions are **JWT** via NextAuth with `AUTH_SECRET`.
- Role-based authorization on every admin route and server action.
- Input validation and output escaping on all forms; SQL injection protection via Prisma; XSS protection via escaped rendering.
- Per-IP **rate limiting** on the lead submission endpoint.
- **CSRF** protection via NextAuth and form tokens.
- Secure file handling — media URLs are allowlisted; uploaded filenames are sanitized.
- **Activity log** records login, create/update/delete, status changes, and settings changes with user, timestamp, and IP.

---

## Project Structure

```
prisma/
  schema.prisma        # full data model
  seed.ts              # demo company data (clearly marked)
  migrations/          # versioned SQL migrations
src/
  app/
    (site)/            # public site — layout (header/footer) + all pages
    admin/             # admin dashboard — layout (sidebar/auth guard) + 35 routes
    api/
      auth/[...nextauth]/ # NextAuth handler
      leads/           # public lead submission (POST)
    globals.css        # design system with brand CSS variables
    layout.tsx         # root layout (fonts, branding vars, tracking)
    sitemap.ts / robots.ts / middleware.ts
  components/
    site/              # hero, trust bar, project cards, before/after slider, FAQs, etc.
    admin/             # sidebar, tables, forms, demo banner
    ui/                # icon set, stars, safe image
  lib/
    prisma.ts          # singleton Prisma client
    auth.ts            # NextAuth config + role helpers
    cms.ts             # cached company settings / menus / branding loaders
    seo.ts             # metadata + JSON-LD builders
    utils.ts           # cn, slugify, formatPhone, placeholder, etc.
    activity.ts        # audit trail writer
    admin/entities.ts  # CMS field definitions (no page builder)
    actions/           # server actions (crud, leads, settings, appearance, users, etc.)
  auth.ts              # NextAuth instance
public/
  favicon.svg
  uploads/.gitkeep
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (runs `prisma generate` via `postinstall`) |
| `npm start` | Start production server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run db:migrate` | `prisma migrate dev --name init` |
| `npm run db:seed` | Seed demo data (`tsx prisma/seed.ts`) |
| `npm run db:setup` | generate + migrate + seed |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:use-postgres` | Switch schema provider to `postgresql` |

---

## Notes

- **No page builder.** Page layouts are professionally designed templates; the admin controls content inside predefined, structured fields. Adding freeform drag-and-drop would be a separate project.
- **Demo data** is seeded with `isVerified` reviews and `demoMode = true`. Dismiss or replace it before launch — the admin banner reminds you.
- **Performance:** First Load JS is ~103 kB shared + ~3–5 kB per page. Images use `next/image` with lazy loading and responsive sizing.
- **Accessibility:** Semantic HTML, heading hierarchy, keyboard navigation, visible focus states, labeled forms, alt text, color contrast, and `aria-*` only where needed.
