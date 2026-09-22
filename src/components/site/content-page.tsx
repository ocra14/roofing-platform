import { PageHero } from "@/components/site/page-hero";
import { buildMetadata } from "@/lib/seo";

/**
 * Renders a CMS-managed content page (e.g. Privacy Policy, Terms, Cookie
 * Policy) using the predefined "legal" template. Layout is fixed - admin
 * controls only the content, per the no-page-builder requirement.
 */
export function ContentPage({
  page,
}: {
  page: {
    slug: string;
    title: string;
    excerpt?: string | null;
    content?: string | null;
    publishedAt?: Date | null;
  };
}) {
  const paragraphs = (page.content || "").split("\n\n").filter(Boolean);

  return (
    <>
      <PageHero
        title={page.title}
        description={page.excerpt}
        crumbs={[{ name: "Home", url: "/" }, { name: page.title }]}
      />
      <section className="section">
        <div className="container-page max-w-3xl">
          {paragraphs.length ? (
            <div className="prose-roofing">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-muted">Content for this page is being prepared.</p>
          )}
          {page.publishedAt ? (
            <p className="mt-10 border-t border-line pt-6 text-xs text-muted">
              Last updated:{" "}
              {page.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
