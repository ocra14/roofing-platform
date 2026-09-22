import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { AdminTable } from "@/components/admin/table";
import { Icon, type IconName } from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function AdminDashboard() {
  const monthStart = startOfMonth();

  const [
    totalLeads,
    monthLeads,
    newLeads,
    contacted,
    scheduled,
    won,
    lost,
    recentLeads,
    services,
    locations,
    recentProjects,
    recentReviews,
    projectsCount,
    reviewsCount,
    publishedPosts,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "INSPECTION_SCHEDULED" } }),
    prisma.lead.count({ where: { status: "WON" } }),
    prisma.lead.count({ where: { status: "LOST" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
    prisma.service.findMany({
      where: { kind: "SERVICE" },
      select: { id: true, name: true, _count: { select: { leads: true } } },
    }),
    prisma.location.findMany({
      select: { id: true, city: true, _count: { select: { leads: true } } },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { location: { select: { city: true } } },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, customerName: true, rating: true, text: true, createdAt: true },
    }),
    prisma.project.count({ where: { isEnabled: true } }),
    prisma.review.count({ where: { isEnabled: true } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
  ]);

  const stats: { label: string; value: number | string; icon: IconName; tone: string }[] = [
    { label: "Leads This Month", value: monthLeads, icon: "send", tone: "text-secondary" },
    { label: "New Leads", value: newLeads, icon: "bell", tone: "text-emerald-600" },
    { label: "Contacted", value: contacted, icon: "phone", tone: "text-blue-600" },
    { label: "Inspections Scheduled", value: scheduled, icon: "calendar-check", tone: "text-indigo-600" },
    { label: "Won", value: won, icon: "check", tone: "text-emerald-600" },
    { label: "Lost", value: lost, icon: "x", tone: "text-red-600" },
  ];

  const topServices = [...services].sort((a, b) => b._count.leads - a._count.leads).slice(0, 5);
  const topLocations = [...locations].sort((a, b) => b._count.leads - a._count.leads).slice(0, 5);
  const maxServiceLeads = Math.max(1, ...topServices.map((s) => s._count.leads));
  const maxLocationLeads = Math.max(1, ...topLocations.map((l) => l._count.leads));

  const wonRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Your business at a glance - leads, content, and recent activity."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-canvas ${stat.tone}`}>
              <Icon name={stat.icon} size={18} />
            </span>
            <div className="mt-3.5 font-display text-2xl font-bold text-ink">{stat.value}</div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Lead pipeline */}
        <AdminCard title="Lead Pipeline" description={`${wonRate}% close rate across all time`} className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {[
              { label: "Total Leads", value: totalLeads },
              { label: "This Month", value: monthLeads },
              { label: "Won", value: won },
              { label: "In Progress", value: contacted + scheduled },
              { label: "Lost", value: lost },
              { label: "Avg. Rating", value: "—" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xs font-bold uppercase tracking-wide text-muted">{item.label}</div>
                <div className="mt-1 font-display text-xl font-bold text-primary">{item.value}</div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Content summary */}
        <AdminCard title="Website Content">
          <ul className="space-y-3.5">
            {[
              { label: "Services", value: services.length, href: "/admin/services/" },
              { label: "Service Areas", value: locations.length, href: "/admin/locations/" },
              { label: "Projects", value: projectsCount, href: "/admin/projects/" },
              { label: "Reviews", value: reviewsCount, href: "/admin/reviews/" },
              { label: "Published Posts", value: publishedPosts, href: "/admin/blog/" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 transition-colors hover:border-primary/30 hover:bg-canvas/50"
                >
                  <span className="text-sm font-medium text-ink">{item.label}</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-primary">
                    {item.value}
                    <Icon name="arrow-right" size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Top services by leads */}
        <AdminCard title="Top Services by Leads">
          {topServices.length ? (
            <div className="space-y-4">
              {topServices.map((s) => (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="font-semibold text-muted">{s._count.leads}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${Math.max(4, (s._count.leads / maxServiceLeads) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No leads yet.</p>
          )}
        </AdminCard>

        {/* Top locations */}
        <AdminCard title="Top Locations by Leads">
          {topLocations.length ? (
            <div className="space-y-4">
              {topLocations.map((l) => (
                <div key={l.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{l.city}</span>
                    <span className="font-semibold text-muted">{l._count.leads}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(4, (l._count.leads / maxLocationLeads) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No locations yet.</p>
          )}
        </AdminCard>

        {/* Recent reviews */}
        <AdminCard title="Recent Reviews">
          {recentReviews.length ? (
            <ul className="space-y-4">
              {recentReviews.map((r) => (
                <li key={r.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{r.customerName}</span>
                    <span className="text-xs text-amber-500">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{r.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No reviews yet.</p>
          )}
        </AdminCard>
      </div>

      {/* Recent leads */}
      <div className="mt-6">
        <AdminPageHeader
          title="Recent Leads"
          actionLabel="View All Leads"
          actionHref="/admin/leads/"
        />
        <AdminTable
          columns={[
            {
              key: "name",
              label: "Customer",
              render: (lead) => (
                <span className="font-semibold text-ink">
                  {lead.firstName} {lead.lastName || ""}
                </span>
              ),
            },
            { key: "contact", label: "Contact", render: (lead) => <span className="text-muted">{lead.phone || lead.email || "—"}</span> },
            { key: "service", label: "Service", render: (lead) => <span className="text-muted">{lead.service?.name || "—"}</span> },
            { key: "location", label: "City", render: (lead) => <span className="text-muted">{lead.location?.city || lead.city || "—"}</span> },
            {
              key: "status",
              label: "Status",
              render: (lead) => <LeadStatusBadge status={lead.status} />,
            },
            { key: "created", label: "Received", render: (lead) => <span className="whitespace-nowrap text-muted">{formatDate(lead.createdAt)}</span> },
          ]}
          rows={recentLeads}
          editHref={(lead) => `/admin/leads/${lead.id}/`}
          emptyTitle="No leads yet"
          emptyDescription="Leads from your website forms will appear here."
        />
      </div>

      {/* Recent projects */}
      <div className="mt-6">
        <AdminPageHeader
          title="Recent Projects"
          actionLabel="View All Projects"
          actionHref="/admin/projects/"
        />
        {recentProjects.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}/`}
                className="card card-hover p-5"
              >
                <h3 className="text-sm font-semibold leading-snug text-ink line-clamp-2">{p.title}</h3>
                <p className="mt-2 text-xs text-muted">{p.location?.city || "—"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No projects yet.</p>
        )}
      </div>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 ring-blue-200",
    CONTACTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    INSPECTION_SCHEDULED: "bg-purple-50 text-purple-700 ring-purple-200",
    ESTIMATE_SENT: "bg-amber-50 text-amber-700 ring-amber-200",
    WON: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    LOST: "bg-red-50 text-red-700 ring-red-200",
  };
  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    INSPECTION_SCHEDULED: "Inspection Scheduled",
    ESTIMATE_SENT: "Estimate Sent",
    WON: "Won",
    LOST: "Lost",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.NEW}`}
    >
      {labels[status] || status}
    </span>
  );
}
