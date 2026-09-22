import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/cms";
import { Stars } from "@/components/ui/stars";
import { ReviewsGrid } from "@/components/site/review-card";
import { Icon } from "@/components/ui/icon";

export async function ReviewsPreview({ limit = 3 }: { limit?: number }) {
  const [company, reviews] = await Promise.all([
    getCompanySettings(),
    prisma.review.findMany({
      where: { isEnabled: true, isFeatured: true },
      orderBy: [{ reviewedAt: "desc" }],
      take: limit,
      include: { service: { select: { name: true } }, location: { select: { city: true } } },
    }),
  ]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : company.googleRating;

  return (
    <section className="section" id="reviews">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Customer Reviews</span>
            <h2 className="mt-3">What Homeowners Say</h2>
            <p className="lead mt-4">
              Real feedback from real customers. These are reviews submitted through our website and
              verified review platforms.
            </p>
          </div>

          {avg > 0 ? (
            <div className="flex shrink-0 items-center gap-4 rounded-xl border border-line bg-surface p-5">
              <div>
                <div className="font-display text-3xl font-bold text-primary">{avg.toFixed(1)}</div>
                <Stars rating={avg} size={15} className="mt-1" />
              </div>
              <div className="h-12 w-px bg-line" />
              <div className="text-sm text-muted">
                <span className="block font-semibold text-ink">
                  {company.reviewCount.toLocaleString()}+ reviews
                </span>
                across Google and verified sources
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-10">
          <ReviewsGrid reviews={reviews} />
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/reviews/" className="btn btn-outline">
            Read All Reviews
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
