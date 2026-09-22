import { Stars } from "@/components/ui/stars";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";

export type ReviewWithRelations = {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  reviewedAt: Date | string;
  source: string;
  service: { name: string } | null;
  location: { city: string } | null;
};

const SOURCE_LABEL: Record<string, string> = {
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
  WEBSITE: "Verified Website",
  ANGIE: "Angi",
  BBB: "BBB",
  OTHER: "Verified",
};

export function ReviewCard({ review }: { review: ReviewWithRelations }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} size={16} />
        <span className="badge">{SOURCE_LABEL[review.source] || "Review"}</span>
      </div>
      <blockquote className="mt-4 flex-1">
        <Icon name="quote" size={22} className="text-accent/40" />
        <p className="mt-2 text-sm leading-relaxed text-ink/85">“{review.text}”</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
          {review.customerName.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">{review.customerName}</span>
          <span className="block text-xs text-muted">
            {review.service?.name ? `${review.service.name} • ` : ""}
            {review.location?.city ? `${review.location.city} • ` : ""}
            {formatDate(review.reviewedAt)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ReviewsGrid({ reviews }: { reviews: ReviewWithRelations[] }) {
  if (!reviews.length) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-muted">
        No reviews yet.
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
