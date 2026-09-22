import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { saveBlogPost, deleteBlogPost } from "@/lib/actions/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog" };

type SP = Promise<{ page?: string }>;

export default async function BlogAdminPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt((sp.page as string) || "1", 10) || 1);
  const PAGE_SIZE = 20;
  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { category: { select: { name: true } }, author: { select: { name: true } } } }),
    prisma.blogPost.count(),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Blog" description={`${total} posts. Write and publish roofing guides for your customers.`} />
      <AdminCard title="New Blog Post">
        <form action={saveBlogPost} className="grid gap-4">
          <input type="hidden" name="id" value="new" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Title</label><input name="title" required className="field-input" /></div>
            <div><label className="field-label">Slug</label><input name="slug" required placeholder="my-article" className="field-input" /></div>
            <div>
              <label className="field-label">Category</label>
              <select name="categoryId" className="field-select"><option value="">— No category —</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select name="status" className="field-select"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="SCHEDULED">Scheduled</option></select>
            </div>
            <div className="sm:col-span-2"><label className="field-label">Excerpt</label><input name="excerpt" className="field-input" /></div>
            <div className="sm:col-span-2"><label className="field-label">Content (Markdown)</label><textarea name="content" rows={8} required className="field-textarea font-mono text-sm" placeholder="## Heading&#10;Paragraph..." /></div>
          </div>
          <div className="flex justify-end"><button type="submit" className="btn btn-primary"><Icon name="plus" size={16} />Create Post</button></div>
        </form>
      </AdminCard>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-canvas/60">
              <tr>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Title</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Status</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Category</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Author</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted">Date</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/40">
                  <td className="px-4 py-3.5 font-semibold text-ink">{p.title}</td>
                  <td className="px-4 py-3.5"><span className={`badge ${p.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : p.status === "DRAFT" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>{p.status}</span></td>
                  <td className="px-4 py-3.5 text-muted">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3.5 text-muted">{p.author?.name || "—"}</td>
                  <td className="px-4 py-3.5 text-muted">{formatDate(p.publishedAt ?? p.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <a href={`/admin/blog/${p.id}/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"><Icon name="edit" size={15} />Edit</a>
                    <form action={deleteBlogPost} className="ml-3 inline-block">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-700">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {posts.length === 0 ? <p className="mt-4 text-center text-sm text-muted">No posts yet. Create one above.</p> : null}
      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 ? <a href={`/admin/blog/?page=${page - 1}`} className="btn btn-outline btn-sm">Previous</a> : null}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages ? <a href={`/admin/blog/?page=${page + 1}`} className="btn btn-outline btn-sm">Next</a> : null}
        </div>
      ) : null}
    </div>
  );
}
