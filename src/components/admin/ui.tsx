import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}
      </div>
      <div className="flex items-center gap-2.5">
        {children}
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="btn btn-primary">
            <Icon name="plus" size={16} />
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-6 md:p-7 ${className}`}>
      {title ? (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
        <Icon name="file" size={26} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm text-muted">{description}</p> : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn btn-primary mt-6">
          <Icon name="plus" size={16} />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function StatusBadge({ active, label }: { active: boolean; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`}
        aria-hidden="true"
      />
      {label || (active ? "Active" : "Inactive")}
    </span>
  );
}
