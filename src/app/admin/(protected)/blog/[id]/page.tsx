import { prisma } from "@/lib/prisma";
import { ImageField } from "@/components/admin/image-field";
import { Icon } from "@/components/ui/icon";
import { saveBlogPost, deleteBlogPost } from "@/lib/actions/content";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Blog Post" };

type Params = Promise<{ id: string }>;

export default async function BlogEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id }, include: { featuredImage: { select: { url: true } } } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();
  return (
    <div>
      <a href="/admin/blog/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <Icon name="arrow-right" size={15} className="rotate-180" />Back to Blog
      </a>
      <h1 className="text-2xl font-bold text-ink">Edit Post</h1>
      <form action={saveBlogPost} className="card mt-6 p-6 md:p-7">
        <input type="hidden" name="id" value={post.id} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="field-label">Title</label><input name="title" defaultValue={post.title} required className="field-input" /></div>
          <div><label className="field-label">Slug</label><input name="slug" defaultValue={post.slug} required className="field-input" /></div>
          <div>
            <label className="field-label">Category</label>
            <select name="categoryId" defaultValue={post.categoryId || ""} className="field-select"><option value="">— No category —</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </div>
          <div>
            <label className="field-label">Status</label>
            <select name="status" defaultValue={post.status} className="field-select"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="SCHEDULED">Scheduled</option></select>
          </div>
          <div className="sm:col-span-2"><label className="field-label">Excerpt</label><input name="excerpt" defaultValue={post.excerpt || ""} className="field-input" /></div>
          <div className="sm:col-span-2">
            <ImageField
              name="featuredImageUrl"
              label="Featured Image"
              defaultValue={post.featuredImage?.url || ""}
              helpText="Drop a cover image here, or paste an image URL. Shown on the blog list and article page."
              folder="blog"
            />
          </div>
          <div className="sm:col-span-2"><label className="field-label">Content</label><textarea name="content" rows={12} defaultValue={post.content} required className="field-textarea font-mono text-sm" /></div>
          <div><label className="field-label">SEO Title</label><input name="seoTitle" defaultValue={post.seoTitle || ""} className="field-input" /></div>
          <div><label className="field-label">SEO Description</label><input name="seoDescription" defaultValue={post.seoDescription || ""} className="field-input" /></div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button type="submit" formAction={async (fd: FormData) => { "use server"; await deleteBlogPost(fd); }} className="text-sm font-semibold text-red-600">Delete Post</button>
          <button type="submit" className="btn btn-primary btn-lg"><Icon name="save" size={17} />Save Changes</button>
        </div>
      </form>
    </div>
  );
}
