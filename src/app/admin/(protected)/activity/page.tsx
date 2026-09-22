import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Activity Log" };

type SP = Promise<{ page?: string }>;

export default async function ActivityPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt((sp.page as string) || "1", 10) || 1);
  const PAGE_SIZE = 50;
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { user: { select: { name: true, email: true } } } }),
    prisma.activityLog.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <div>
      <AdminPageHeader title="Activity Log" description={`${total} events recorded.`} />
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-canvas/60">
              <tr>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">When</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">User</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Action</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-canvas/40">
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3.5 text-ink">{log.user?.name || log.user?.email || "—"}</td>
                  <td className="px-4 py-3.5"><span className="badge">{log.action}</span></td>
                  <td className="px-4 py-3.5 text-muted">{log.entity ? `${log.entity}${log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}` : ""} {log.summary ? `— ${log.summary}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {logs.length === 0 ? <p className="mt-6 text-center text-sm text-muted">No activity yet.</p> : null}
      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 ? <a href={`/admin/activity/?page=${page - 1}`} className="btn btn-outline btn-sm">Previous</a> : null}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages ? <a href={`/admin/activity/?page=${page + 1}`} className="btn btn-outline btn-sm">Next</a> : null}
        </div>
      ) : null}
    </div>
  );
}
