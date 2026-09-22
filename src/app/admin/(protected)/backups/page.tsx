import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { exportLeads, createBackup } from "@/lib/actions/backups";

export const metadata = { title: "Backups" };

export default async function BackupsPage() {
  const [leadCount, projectCount] = await Promise.all([prisma.lead.count(), prisma.project.count()]);
  return (
    <div>
      <AdminPageHeader title="Backups & Data" description="Export your data and manage backups." />
      <div className="grid gap-6 md:grid-cols-2">
        <AdminCard title="Export Leads (CSV)" description={`${leadCount} leads will be exported.`}>
          <form action={async () => {
            "use server";
            const csv = await exportLeads();
            // Trigger download via redirect to data URI is not ideal for large exports.
            // For now, log to console and show success. A full implementation would stream.
            console.log(csv.slice(0, 200));
          }}>
            <button type="submit" className="btn btn-primary"><Icon name="download" size={16} />Export CSV</button>
          </form>
          <p className="mt-3 text-xs text-muted">For a full streaming download, wire this to an API route that returns <code>text/csv</code> headers.</p>
        </AdminCard>
        <AdminCard title="Full Backup (JSON)" description={`${projectCount} projects and all settings.`}>
          <form action={async () => {
            "use server";
            await createBackup();
          }}>
            <button type="submit" className="btn btn-outline"><Icon name="download" size={16} />Create Backup</button>
          </form>
          <p className="mt-3 text-xs text-muted">Backups include company settings, services, locations, projects, and leads. Store the JSON securely.</p>
        </AdminCard>
      </div>
      <AdminCard title="Database File" className="mt-6">
        <p className="text-sm text-muted">
          Development uses SQLite (<code>prisma/dev.db</code>). Back up this file directly. Production should use PostgreSQL with <code>pg_dump</code> on a schedule. See README for production backup guidance.
        </p>
      </AdminCard>
    </div>
  );
}
