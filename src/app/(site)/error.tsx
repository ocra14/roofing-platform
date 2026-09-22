"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icon name="alert" size={28} />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted">Ref: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <Icon name="arrow-right" size={16} className="rotate-180" />
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          <Icon name="home" size={16} />
          Back to home
        </Link>
      </div>
    </section>
  );
}
