import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { LeadStatusBadge } from "@/components/admin/lead-status";
import { Icon } from "@/components/ui/icon";
import { formatDate, formatPhone, telHref } from "@/lib/utils";
import { updateLeadStatus, addLeadNote } from "@/lib/actions/leads";

export const metadata = { title: "Lead Detail" };

type Params = Promise<{ id: string }>;

export default async function LeadDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      service: { select: { name: true, slug: true } },
      location: { select: { city: true, slug: true } },
      form: { select: { name: true, slug: true } },
      assignedTo: { select: { name: true } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
    },
  });

  if (!lead) notFound();

  const statuses = ["NEW", "CONTACTED", "INSPECTION_SCHEDULED", "ESTIMATE_SENT", "WON", "LOST"];

  const detailRows: { label: string; value?: string | null }[] = [
    { label: "Phone", value: lead.phone ? formatPhone(lead.phone) : null },
    { label: "Email", value: lead.email },
    { label: "City", value: lead.city },
    { label: "ZIP Code", value: lead.zipCode },
    { label: "Service Requested", value: lead.service?.name },
    { label: "Property Type", value: lead.propertyType },
    { label: "Roof Type", value: lead.roofType },
    { label: "Preferred Contact", value: lead.preferredContact },
    { label: "Appointment Date", value: lead.appointmentDate ? formatDate(lead.appointmentDate) : null },
    { label: "Source", value: lead.source.replace(/_/g, " ") },
    { label: "Form", value: lead.form?.name },
    { label: "Assigned To", value: lead.assignedTo?.name || "Unassigned" },
    { label: "Received", value: formatDate(lead.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/leads/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
        >
          <Icon name="arrow-right" size={15} className="rotate-180" />
          Back to Leads
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {lead.firstName} {lead.lastName || ""}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {lead.service?.name || "General inquiry"} • {lead.location?.city || lead.city || "Location n/a"}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: message + details + notes */}
        <div className="space-y-6 lg:col-span-2">
          {lead.message ? (
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Message</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/90">{lead.message}</p>
            </div>
          ) : null}

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Contact Details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.label} className="border-b border-line pb-3">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">{row.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{row.value || "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {lead.phone ? (
                <a href={telHref(lead.phone)} className="btn btn-secondary btn-sm">
                  <Icon name="phone" size={15} />
                  Call {formatPhone(lead.phone)}
                </a>
              ) : null}
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="btn btn-outline btn-sm">
                  <Icon name="mail" size={15} />
                  Email
                </a>
              ) : null}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
              Notes &amp; History
            </h2>

            <form action={addLeadNote} className="mt-4">
              <input type="hidden" name="leadId" value={lead.id} />
              <textarea
                name="body"
                rows={3}
                required
                className="field-textarea"
                placeholder="Add a note about this lead…"
                aria-label="New note"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-muted">
                  <input type="checkbox" name="isInternal" className="h-4 w-4 rounded border-line" />
                  Internal note (not for the customer)
                </label>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Icon name="plus" size={15} />
                  Add Note
                </button>
              </div>
            </form>

            {lead.notes.length ? (
              <ul className="mt-6 space-y-4">
                {lead.notes.map((note) => (
                  <li key={note.id} className="rounded-lg border border-line bg-canvas/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">{note.author?.name || "System"}</span>
                      <span className="text-xs text-muted">{formatDate(note.createdAt)}</span>
                    </div>
                    {note.isInternal ? (
                      <span className="mt-1.5 inline-flex rounded bg-amber-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-amber-700 ring-1 ring-amber-200">
                        Internal
                      </span>
                    ) : null}
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">{note.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted">No notes yet. Add the first one above.</p>
            )}
          </div>
        </div>

        {/* Right column: status pipeline */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Lead Status</h2>
            <form action={updateLeadStatus} className="mt-4 space-y-2">
              <input type="hidden" name="leadId" value={lead.id} />
              {statuses.map((status) => (
                <button
                  key={status}
                  type="submit"
                  name="status"
                  value={status}
                  className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    lead.status === status
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-line text-ink hover:border-primary/40 hover:bg-canvas/50"
                  }`}
                >
                  {status.replace(/_/g, " ")}
                  {lead.status === status ? <Icon name="check" size={16} /> : null}
                </button>
              ))}
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Quick Links</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {lead.service ? (
                <li>
                  <Link href={`/${lead.service.slug}/`} className="font-medium text-secondary hover:text-primary">
                    View {lead.service.name} page
                  </Link>
                </li>
              ) : null}
              {lead.location ? (
                <li>
                  <Link href={`/service-areas/${lead.location.slug}/`} className="font-medium text-secondary hover:text-primary">
                    View {lead.location.city} page
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <p className="px-1 text-xs text-muted">
            Signed in as <span className="font-semibold">{session?.user?.name}</span>. Status changes
            are recorded in the activity log.
          </p>
        </div>
      </div>
    </div>
  );
}
