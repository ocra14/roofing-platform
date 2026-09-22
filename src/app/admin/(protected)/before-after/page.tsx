import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";

export const metadata = { title: "Before & After" };

export default async function BeforeAfterAdminPage() {
  const projects = await prisma.project.findMany({
    where: { isEnabled: true, isBeforeAfter: true },
    orderBy: { projectDate: "desc" },
    include: { beforeImage: { select: { url: true } }, afterImage: { select: { url: true } }, service: { select: { name: true } }, location: { select: { city: true } } },
  });
  return (
    <div>
      <AdminPageHeader title="Before & After" description="Projects marked as Before & After appear with the comparison slider on your site." />
      {projects.length ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="card overflow-hidden p-0">
              <div className="grid grid-cols-2 gap-0">
                <div className="aspect-square overflow-hidden bg-canvas">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.beforeImage?.url ? <img src={p.beforeImage.url} alt="Before" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-muted">No before image</div>}
                </div>
                <div className="aspect-square overflow-hidden bg-canvas">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.afterImage?.url ? <img src={p.afterImage.url} alt="After" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-muted">No after image</div>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                <p className="mt-1 text-xs text-muted">{p.service?.name || "—"} • {p.location?.city || "—"}</p>
                <a href={`/admin/projects/${p.id}/`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"><Icon name="edit" size={15} />Edit Project</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminCard title="No Before & After projects">
          <p className="text-sm text-muted">Mark a project as &quot;Include in Before &amp; After&quot; in its edit page, and upload before/after images via their URLs.</p>
          <a href="/admin/projects/" className="btn btn-primary mt-4"><Icon name="edit" size={16} />Manage Projects</a>
        </AdminCard>
      )}
    </div>
  );
}
