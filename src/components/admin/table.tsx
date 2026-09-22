import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export type Column<T> = {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  editHref,
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: {
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
          <Icon name="file" size={26} />
        </span>
        <h3 className="mt-5 text-lg font-bold text-ink">{emptyTitle}</h3>
        {emptyDescription ? <p className="mt-2 max-w-sm text-sm text-muted">{emptyDescription}</p> : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-canvas/60">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-muted ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
              {editHref ? <th className="px-4 py-3.5" aria-label="Actions" /> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-canvas/40">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 align-middle ${col.className || ""}`}>
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
                {editHref ? (
                  <td className="px-4 py-3.5 text-right align-middle">
                    <Link
                      href={editHref(row)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"
                    >
                      <Icon name="edit" size={15} />
                      Edit
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className="btn btn-outline btn-sm">
          Previous
        </Link>
      ) : null}
      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}?page=${p}`}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold ${
            p === page ? "bg-primary text-white" : "border border-line bg-surface text-ink hover:bg-canvas"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className="btn btn-outline btn-sm">
          Next
        </Link>
      ) : null}
    </div>
  );
}
