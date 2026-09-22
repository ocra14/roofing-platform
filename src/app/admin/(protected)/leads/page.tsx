import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, Pagination } from "@/components/admin/table";
import { LeadStatusBadge } from "@/components/admin/lead-status";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Leads" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ status?: string; service?: string; page?: string }>;

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = sp.status || "";
  const serviceId = sp.service || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const where = {
    ...(status ? { status: status as any } : {}),
    ...(serviceId ? { serviceId } : {}),
  };

  const [leads, total, services] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
    prisma.lead.count({ where }),
    prisma.service.findMany({ where: { kind: "SERVICE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function statusHref(value: string) {
    const params = new URLSearchParams();
    if (serviceId) params.set("service", serviceId);
    if (value) params.set("status", value);
    return `/admin/leads/?${params.toString()}`;
  }

  const statuses = ["NEW", "CONTACTED", "INSPECTION_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST"];

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description={`${total} total leads. Track each one from first contact to close.`}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <a
          href="/admin/leads/"
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${
            !status ? "bg-primary text-white ring-primary" : "bg-surface text-muted ring-line hover:text-primary"
          }`}
        >
          All
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={statusHref(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${
              status === s ? "bg-primary text-white ring-primary" : "bg-surface text-muted ring-line hover:text-primary"
            }`}
          >
            {s.replace(/_/g, " ")}
          </a>
        ))}
      </div>

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
          { key: "contact", label: "Contact", render: (lead) => <span className="whitespace-nowrap text-muted">{lead.phone || lead.email || "—"}</span> },
          { key: "service", label: "Service", render: (lead) => <span className="text-muted">{lead.service?.name || "—"}</span> },
          { key: "location", label: "City", render: (lead) => <span className="text-muted">{lead.location?.city || lead.city || "—"}</span> },
          { key: "status", label: "Status", render: (lead) => <LeadStatusBadge status={lead.status} /> },
          { key: "created", label: "Received", render: (lead) => <span className="whitespace-nowrap text-muted">{formatDate(lead.createdAt)}</span> },
        ]}
        rows={leads}
        editHref={(lead) => `/admin/leads/${lead.id}/`}
        emptyTitle="No leads yet"
        emptyDescription="Leads submitted through your website forms will appear here automatically."
      />

      <Pagination page={page} totalPages={totalPages} basePath="/admin/leads/" />
    </div>
  );
}
