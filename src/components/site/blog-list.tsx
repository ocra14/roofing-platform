import Link from "next/link";
import { Img } from "@/components/ui/img";
import { formatDate } from "@/lib/utils";

export type PostWithRelations = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  readingMinutes: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string } | null;
  author: { name: string } | null;
  featuredImage?: { url: string } | null;
};

export function BlogList({ posts }: { posts: PostWithRelations[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-muted">
        No articles published yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="card card-hover group flex flex-col overflow-hidden">
          <Link href={`/blog/${post.slug}/`} className="relative aspect-[16/9] overflow-hidden bg-canvas">
            <Img
              src={post.featuredImage?.url ?? null}
              alt={post.title}
              width={640}
              height={360}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fallbackLabel={post.category?.name || "Roofing article"}
              fallbackTone="slate"
            />
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
              {post.category ? <span>{post.category.name}</span> : null}
              <span className="text-line">•</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h3 className="mt-2.5 text-base leading-snug">
              <Link href={`/blog/${post.slug}/`} className="transition-colors hover:text-primary">
                {post.title}
              </Link>
            </h3>
            {post.excerpt ? (
              <p className="mt-2 flex-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
            ) : null}
            <div className="mt-4 border-t border-line pt-3.5 text-xs text-muted">
              {post.author?.name ? <span>{post.author.name} • </span> : null}
              {formatDate(post.publishedAt ?? post.createdAt)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
