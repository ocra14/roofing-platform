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
  // Totals come from Company Settings so a real business replaces demo figures in Admin.
  const totalCount = company.reviewCount > 0 ? company.reviewCount : reviews.length;

  return (
    <section className="section bg-surface" id="reviews">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="eyebrow justify-center">Customer Reviews</span>
          <h2 className="mt-3">What Homeowners Say</h2>
          {avg > 0 ? (
            <div className="mt-5 inline-flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl font-extrabold tracking-[-0.02em] text-primary">
                  {avg.toFixed(1)}
                </span>
                <Stars rating={avg} size={20} />
              </div>
              <p className="text-sm text-muted">
                Based on <span className="font-semibold text-ink">{totalCount.toLocaleString()} reviews</span>{" "}
                across Google and verified sources
              </p>
            </div>
          ) : (
            <p className="lead mt-4">
              Real feedback from real customers — reviews submitted through our website and
              verified review platforms.
            </p>
          )}
        </div>

        <div className="mt-10">
          <ReviewsGrid reviews={reviews} />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/reviews/" className="btn btn-outline">
            Read All Reviews
            <Icon name="arrow-right" size={16} />
          </Link>
          <Link href="/free-estimate/" className="btn btn-primary">
            Get a Free Estimate
            <Icon name="send" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
