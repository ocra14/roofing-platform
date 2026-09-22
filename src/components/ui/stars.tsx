import { Icon } from "@/components/ui/icon";

export function Stars({
  rating,
  size = 16,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && hasHalf;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            {/* Base (empty) star */}
            <Icon
              name="star"
              size={size}
              strokeWidth={1.5}
              className="absolute inset-0 text-amber-500/30"
            />
            {/* Full or half fill */}
            {(isFull || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? "50%" : "100%" }}
              >
                <Icon name="star" size={size} strokeWidth={1.5} fill="currentColor" className="text-amber-500" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
