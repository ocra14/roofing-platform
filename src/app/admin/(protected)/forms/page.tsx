import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";

export const metadata = { title: "Forms" };

export default async function FormsPage() {
  const forms = await prisma.form.findMany({ include: { fields: true, _count: { select: { submissions: true } } }, orderBy: { name: "asc" } });
  return (
    <div>
      <AdminPageHeader title="Forms" description="Manage website forms and their fields. Each submission creates a lead automatically." />
      <div className="grid gap-6">
        {forms.map((form) => (
          <AdminCard key={form.id} title={form.name} description={`${form.fields.length} fields • ${form._count.submissions} submissions • ${form.isEnabled ? "Active" : "Inactive"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line">
                  <tr>
                    <th className="py-2 text-xs font-bold uppercase tracking-wide text-muted">Field</th>
                    <th className="py-2 text-xs font-bold uppercase tracking-wide text-muted">Type</th>
                    <th className="py-2 text-xs font-bold uppercase tracking-wide text-muted">Required</th>
                    <th className="py-2 text-xs font-bold uppercase tracking-wide text-muted">Width</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {form.fields.sort((a, b) => a.order - b.order).map((f) => (
                    <tr key={f.id}>
                      <td className="py-2 font-medium text-ink">{f.label} <span className="text-xs text-muted">({f.name})</span></td>
                      <td className="py-2 text-muted">{f.type}</td>
                      <td className="py-2 text-muted">{f.required ? "Yes" : "No"}</td>
                      <td className="py-2 text-muted">{f.width}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted">Slug: <code>{form.slug}</code> • Creates lead: {form.createLead ? "Yes" : "No"} • Source: {form.leadSource} • Spam protection: {form.spamProtection ? "On" : "Off"}</p>
          </AdminCard>
        ))}
      </div>
      {forms.length === 0 ? <p className="mt-6 text-center text-sm text-muted">No forms yet. Seed the database with <code>npm run db:seed</code>.</p> : null}
      <AdminCard title="How Forms Work" className="mt-6">
        <p className="text-sm text-muted">
          Forms are defined in <code>prisma/seed.ts</code> and stored as <code>Form</code> + <code>FormField</code> rows. To add a new form or field, create it from the database or extend the seed script. Each submission is validated server-side and creates a <code>Lead</code> record that appears in the lead pipeline.
        </p>
      </AdminCard>
    </div>
  );
}
