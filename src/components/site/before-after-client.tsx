import { BeforeAfter } from "@/components/site/before-after";

/** Thin client wrapper so the before/after page stays a server component. */
export function BeforeAfterClient({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  return <BeforeAfter beforeSrc={before} afterSrc={after} alt={alt} />;
}
