import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/admin-dashboard/",
    title: "Built-In Admin Dashboard",
    description:
      "Update your roofing website without relying on a developer — manage services, projects, reviews, leads, and more from one dashboard.",
  })),
};

const MODULES: { title: string; items: string[] }[] = [
  {
    title: "Leads & Sales",
    items: [
      "Lead pipeline: New → Contacted → Inspection → Estimate → Won / Lost",
      "Lead notes, assignment, search, filter, and CSV export",
      "Every website form creates a lead automatically with spam protection",
    ],
  },
  {
    title: "Website Content",
    items: [
      "Services & roofing materials with benefits, process, FAQs, and SEO",
      "Service areas with local content, maps, and ZIP codes",
      "Projects with before / after images, galleries, and testimonials",
      "Reviews, team members, FAQs, and offers",
      "Blog with categories, scheduling, and SEO metadata",
    ],
  },
  {
    title: "Business Settings",
    items: [
      "Company info, phones, hours, social links, and announcement bar",
      "Brand colors and styling — no code changes needed",
      "Header, footer, and mobile navigation menus",
      "Media library with alt text and folders",
    ],
  },
  {
    title: "Growth & System",
    items: [
      "SEO health checks: missing titles, descriptions, and duplicates",
      "Analytics integrations: GA4, Tag Manager, Meta Pixel, custom scripts",
      "Redirect manager (301 / 302) with instant effect",
      "Role-based users, full activity log, and data backups",
    ],
  },
];

export default function AdminDashboardPage() {
  return (
    <>
      <PageHero
        title="Built-In Admin Dashboard"
        eyebrow="Website Platform"
        description="Update your website without relying on a developer. Everything a roofing business needs — services, projects, reviews, leads, and settings — managed from one secure dashboard."
        crumbs={[{ name: "Home", url: "/" }, { name: "Admin Dashboard" }]}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/admin/login/" className="btn btn-accent">
            <Icon name="eye" size={16} />
            Try the Live Demo
          </Link>
          <Link href="/contact/" className="btn btn-ghost-light">
            Ask About This Platform
          </Link>
        </div>
      </PageHero>

      {/* Dashboard preview */}
      <section className="section">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-24px_rgba(15,39,69,0.35)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-line bg-canvas px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-4 hidden flex-1 truncate rounded-md bg-white px-4 py-1.5 text-xs text-muted ring-1 ring-line sm:block">
                yoursite.com/admin — Dashboard
              </span>
            </div>
            <div className="grid md:grid-cols-[220px_1fr]">
              {/* Sidebar mock */}
              <div className="hidden bg-primary p-5 text-white md:block" aria-hidden="true">
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15">
                    <Icon name="home" size={15} />
                  </span>
                  <span className="text-[13px] font-bold">Admin</span>
                </div>
                <ul className="space-y-1 text-[12.5px]">
                  {["Dashboard", "Leads", "Services", "Service Areas", "Projects", "Reviews", "Blog", "Company Settings", "SEO", "Users"].map(
                    (m, i) => (
                      <li
                        key={m}
                        className={`rounded-lg px-3 py-2 ${i === 0 ? "bg-white/15 font-semibold" : "text-white/65"}`}
                      >
                        {m}
                      </li>
                    )
                  )}
                </ul>
              </div>
              {/* Main panel mock */}
              <div className="p-5 md:p-7" aria-hidden="true">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="h-4 w-32 rounded bg-ink/80" />
                    <div className="mt-2 h-3 w-48 rounded bg-line" />
                  </div>
                  <div className="h-9 w-28 rounded-full bg-accent" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["18", "New leads"],
                    ["6", "Inspections"],
                    ["4.8★", "Avg. rating"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-line p-4">
                      <div className="font-display text-xl font-extrabold text-primary">{v}</div>
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2.5">
                  {["Roof Replacement — Frisco, TX · NEW", "Storm Damage — Fort Worth · Contacted", "Roof Repair — Plano · Estimate Sent"].map(
                    (row) => (
                      <div
                        key={row}
                        className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-[12.5px]"
                      >
                        <span className="font-medium text-ink/80">{row}</span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          Lead
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Illustrative preview of the dashboard layout — sign in to the live demo to explore the real thing.
          </p>
        </div>
      </section>

      {/* Only-shipped-features grid */}
      <section className="section bg-surface">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">What&apos;s Included</span>
            <h2 className="mt-3">Everything Below Ships Today</h2>
            <p className="lead mt-4">
              No mockups, no coming-soon features — every module listed here is live in the dashboard
              right now.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {MODULES.map((group) => (
              <div key={group.title} className="card p-7">
                <h3 className="text-base">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/admin/login/" className="btn btn-primary btn-lg">
              <Icon name="eye" size={17} />
              Explore the Live Demo
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title="Want This Website for Your Roofing Company?"
        description="A complete roofing website with a built-in dashboard — ready to customize with your branding, services, and service areas."
        primaryLabel="Get a Free Estimate"
      />
    </>
  );
}
