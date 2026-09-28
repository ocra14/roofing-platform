import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { MediaDropzone } from "@/components/admin/media-dropzone";
import { Icon } from "@/components/ui/icon";
import { uploadMedia, deleteMedia } from "@/lib/actions/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Media Library" };

type SP = Promise<{ page?: string }>;

export default async function MediaPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt((sp.page as string) || "1", 10) || 1);
  const PAGE_SIZE = 24;
  const [media, total] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.media.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Media Library" description={`${total} files. Drop images to upload them, or paste an image URL — files are optimized automatically when possible.`} />
      <AdminCard title="Upload Images">
        <MediaDropzone />
      </AdminCard>
      <AdminCard title="Add Media by URL" className="mt-6">
        <form action={uploadMedia} className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2"><label className="field-label">Image URL or Path</label><input name="url" required placeholder="https://... or /uploads/photo.jpg" className="field-input" /></div>
          <div><label className="field-label">Folder</label><input name="folder" defaultValue="root" className="field-input" /></div>
          <div className="sm:col-span-2"><label className="field-label">Alt Text</label><input name="altText" placeholder="Describe the image" className="field-input" /></div>
          <div className="flex items-end"><button type="submit" className="btn btn-primary"><Icon name="plus" size={16} />Add Media</button></div>
        </form>
      </AdminCard>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m) => (
          <div key={m.id} className="card overflow-hidden p-0">
            <div className="aspect-square overflow-hidden bg-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.altText || m.filename} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-semibold text-ink">{m.filename}</p>
              <p className="truncate text-xs text-muted">{m.url}</p>
              <p className="mt-1 text-xs text-muted">{m.folder} • {formatDate(m.createdAt)}</p>
              <form action={deleteMedia} className="mt-2">
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      {media.length === 0 ? <p className="mt-6 text-center text-sm text-muted">No media yet. Add your first image above.</p> : null}
      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 ? <a href={`/admin/media/?page=${page - 1}`} className="btn btn-outline btn-sm">Previous</a> : null}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages ? <a href={`/admin/media/?page=${page + 1}`} className="btn btn-outline btn-sm">Next</a> : null}
        </div>
      ) : null}
    </div>
  );
}
