import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";

export const metadata = { title: "SEO" };

export default async function SeoPage() {
  const [services, locations, projects, posts] = await Promise.all([
    prisma.service.findMany({ select: { id: true, name: true, slug: true, seoTitle: true, seoDescription: true, isIndexed: true } }),
    prisma.location.findMany({ select: { id: true, city: true, slug: true, seoTitle: true, seoDescription: true, isIndexed: true } }),
    prisma.project.findMany({ select: { id: true, title: true, slug: true, seoTitle: true, seoDescription: true, isIndexed: true } }),
    prisma.blogPost.findMany({ select: { id: true, title: true, slug: true, seoTitle: true, seoDescription: true, isIndexed: true } }),
  ]);

  const all: { id: string; type: string; name: string; slug: string; seoTitle: string | null; seoDescription: string | null; isIndexed: boolean }[] = [
    ...services.map((s) => ({ id: s.id, type: "Service", name: s.name, slug: s.slug, seoTitle: s.seoTitle, seoDescription: s.seoDescription, isIndexed: s.isIndexed })),
    ...locations.map((l) => ({ id: l.id, type: "Location", name: l.city, slug: `service-areas/${l.slug}`, seoTitle: l.seoTitle, seoDescription: l.seoDescription, isIndexed: l.isIndexed })),
    ...projects.map((p) => ({ id: p.id, type: "Project", name: p.title, slug: `projects/${p.slug}`, seoTitle: p.seoTitle, seoDescription: p.seoDescription, isIndexed: p.isIndexed })),
    ...posts.map((p) => ({ id: p.id, type: "Blog Post", name: p.title, slug: `blog/${p.slug}`, seoTitle: p.seoTitle, seoDescription: p.seoDescription, isIndexed: p.isIndexed })),
  ];

  const missingTitle = all.filter((i) => !i.seoTitle);
  const missingDesc = all.filter((i) => !i.seoDescription);
  const noIndexed = all.filter((i) => !i.isIndexed);

  // Duplicate title check
  const titleCounts = new Map<string, number>();
  for (const item of all) {
    if (item.seoTitle) titleCounts.set(item.seoTitle, (titleCounts.get(item.seoTitle) || 0) + 1);
  }
  const duplicateTitles = [...titleCounts.entries()].filter(([, c]) => c > 1);

  return (
    <div>
      <AdminPageHeader title="SEO Health" description="Automated checks for missing titles, descriptions, and indexing issues." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminCard title="Missing SEO Title" description={`${missingTitle.length} pages`}><p className="text-3xl font-bold text-ink">{missingTitle.length}</p></AdminCard>
        <AdminCard title="Missing Meta Description" description={`${missingDesc.length} pages`}><p className="text-3xl font-bold text-ink">{missingDesc.length}</p></AdminCard>
        <AdminCard title="Noindex Pages" description={`${noIndexed.length} pages hidden from Google`}><p className="text-3xl font-bold text-ink">{noIndexed.length}</p></AdminCard>
        <AdminCard title="Duplicate Titles" description={`${duplicateTitles.length} titles reused`}><p className="text-3xl font-bold text-ink">{duplicateTitles.length}</p></AdminCard>
      </div>

      {missingTitle.length ? (
        <AdminCard title="Pages Missing an SEO Title" className="mt-6">
          <ul className="space-y-2 text-sm">
            {missingTitle.slice(0, 20).map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-2">
                <span className="text-ink">{item.name} <span className="text-xs text-muted">({item.type})</span></span>
                <a href={`/${item.slug}/`} target="_blank" className="text-xs font-semibold text-secondary hover:text-primary">{item.slug}</a>
              </li>
            ))}
          </ul>
          {missingTitle.length > 20 ? <p className="mt-3 text-xs text-muted">And {missingTitle.length - 20} more.</p> : null}
        </AdminCard>
      ) : null}

      {duplicateTitles.length ? (
        <AdminCard title="Duplicate SEO Titles" className="mt-6">
          <ul className="space-y-2 text-sm">
            {duplicateTitles.map(([title, count]) => (
              <li key={title} className="text-ink">{`"${title}"`} <span className="text-muted">— used {count} times</span></li>
            ))}
          </ul>
        </AdminCard>
      ) : null}

      <AdminCard title="Global SEO" className="mt-6">
        <p className="text-sm text-muted">
          Global SEO defaults (site title, description, Open Graph image, robots, sitemap, verification) are controlled via <strong className="text-ink">Company Settings</strong> and <strong className="text-ink">Tracking</strong>. Per-page SEO titles and descriptions are edited on each content page above.
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/admin/settings/" className="btn btn-outline btn-sm"><Icon name="settings" size={15} />Company Settings</a>
          <a href="/sitemap.xml" target="_blank" className="btn btn-outline btn-sm"><Icon name="search" size={15} />View Sitemap</a>
        </div>
      </AdminCard>
    </div>
  );
}
