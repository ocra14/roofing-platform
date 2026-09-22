"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icon name="alert" size={24} />
      </span>
      <h1 className="mt-5 text-xl font-bold text-ink">Admin error</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Something went wrong in the admin. Please try again or contact support.
      </p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted">Ref: {error.digest}</p> : null}
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-sm">
          Try again
        </button>
        <Link href="/admin/" className="btn btn-outline btn-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
