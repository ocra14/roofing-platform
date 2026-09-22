import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { ReviewsGrid } from "@/components/site/review-card";
import { CtaSection } from "@/components/site/cta-section";
import { Stars } from "@/components/ui/stars";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/reviews/",
    title: "Customer Reviews",
    description:
      "Read verified reviews from roofing customers about our roof repair, replacement, storm damage, and commercial roofing services.",
  })),
};

export default async function ReviewsPage() {
  const [reviews, company] = await Promise.all([
    prisma.review.findMany({
      where: { isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { reviewedAt: "desc" }],
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
    getCompanySettings(),
  ]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <PageHero
        title="What Our Customers Say"
        eyebrow="Reviews"
        description="We're proud of the relationships we build with homeowners. Here's what customers have shared about working with us."
        crumbs={[{ name: "Home", url: "/" }, { name: "Reviews" }]}
      />

      <section className="section">
        <div className="container-page">
          {/* Summary */}
          <div className="grid gap-8 rounded-2xl border border-line bg-surface p-7 md:p-9 lg:grid-cols-3">
            <div className="lg:border-r lg:border-line lg:pr-9">
              <div className="font-display text-5xl font-bold text-primary">
                {avg > 0 ? avg.toFixed(1) : company.googleRating > 0 ? company.googleRating.toFixed(1) : "—"}
              </div>
              <Stars rating={avg || company.googleRating} size={19} className="mt-2.5" />
              <p className="mt-3 text-sm text-muted">
                Based on {reviews.length} verified website reviews
                {company.reviewCount ? ` and ${company.reviewCount.toLocaleString()} across verified platforms` : ""}.
              </p>
            </div>
            <div className="lg:col-span-2">
              {reviews.length ? (
                <div className="space-y-2.5">
                  {distribution.map((d) => (
                    <div key={d.star} className="flex items-center gap-3">
                      <span className="w-12 shrink-0 text-sm font-medium text-muted">{d.star} stars</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-canvas">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-sm text-muted">{d.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Reviews collected on external platforms appear on those platforms. Add them here
                  from Admin &gt; Reviews to showcase them on your site.
                </p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <ReviewsGrid reviews={reviews} />
          </div>
        </div>
      </section>

      <CtaSection title="Ready to Join Our Happy Customers?" description="Start with a free, written roof inspection. No pressure and no obligation." />
    </>
  );
}
