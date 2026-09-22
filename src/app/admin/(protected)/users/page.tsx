import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard, StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <AdminPageHeader title="Users & Permissions" description="Manage admin access. Only Super Admins can create or modify users." actionLabel="New User" actionHref="/admin/users/new/" />
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-canvas/60">
              <tr>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Name</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Email</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Role</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-canvas/40">
                  <td className="px-4 py-3.5 font-semibold text-ink">{u.name}</td>
                  <td className="px-4 py-3.5 text-muted">{u.email}</td>
                  <td className="px-4 py-3.5"><span className="badge">{u.role.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3.5"><StatusBadge active={u.isActive} label={u.isActive ? "Active" : "Inactive"} /></td>
                  <td className="px-4 py-3.5 text-right"><a href={`/admin/users/${u.id}/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"><Icon name="edit" size={15} />Edit</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdminCard title="Role Permissions" className="mt-6">
        <ul className="space-y-2 text-sm text-muted">
          <li><strong className="text-ink">Super Admin</strong> — Full access to everything.</li>
          <li><strong className="text-ink">Administrator</strong> — All content, settings, leads, SEO.</li>
          <li><strong className="text-ink">Editor</strong> — Services, projects, reviews, FAQs, blog.</li>
          <li><strong className="text-ink">Sales</strong> — Leads and customer data.</li>
          <li><strong className="text-ink">Marketing</strong> — Blog and offers.</li>
        </ul>
      </AdminCard>
    </div>
  );
}
