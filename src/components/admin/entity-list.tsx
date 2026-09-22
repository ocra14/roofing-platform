import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, Pagination } from "@/components/admin/table";
import { AdminPageHeader } from "@/components/admin/ui";
import { ENTITIES } from "@/lib/admin/entities";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export async function EntityList({
  entity,
  searchParams,
}: {
  entity: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const def = ENTITIES[entity];
  if (!def) throw new Error(`Unknown entity: ${entity}`);

  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const delegate = (prisma as unknown as Record<string, {
    findMany: (a: unknown) => Promise<Record<string, unknown>[]>;
    count: (a: unknown) => Promise<number>;
  }>)[def.model];

  const orderBy = def.orderBy
    ? { [def.orderBy]: def.orderDir || "asc" }
    : { createdAt: "desc" as const };

  const [rows, total] = await Promise.all([
    delegate.findMany({
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    delegate.count({ where: {} }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const renderCell = (row: Record<string, unknown>, key: string) => {
    const value = row[key];
    if (typeof value === "boolean") {
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
            value
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-gray-100 text-gray-600 ring-gray-200"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }
    if (value instanceof Date) return <span className="whitespace-nowrap text-muted">{formatDate(value)}</span>;
    if (value === null || value === undefined) return <span className="text-muted">—</span>;
    const str = String(value);
    return <span className="text-muted line-clamp-1">{str}</span>;
  };

  return (
    <div>
      <AdminPageHeader
        title={def.pluralLabel}
        description={`${total} ${def.pluralLabel.toLowerCase()} in your website.`}
        actionLabel={`New ${def.label}`}
        actionHref={`${def.basePath}new/`}
      />

      <AdminTable
        columns={def.listColumns.map((col) => ({
          key: col.key,
          label: col.label,
          render: (row: Record<string, unknown>) => renderCell(row, col.key),
        }))}
        rows={rows as { id: string }[]}
        editHref={(row) => `${def.basePath}${row.id}/`}
        emptyTitle={`No ${def.pluralLabel.toLowerCase()} yet`}
        emptyDescription={`Create your first ${def.label.toLowerCase()} to see it appear here and on your website.`}
      />

      <Pagination page={page} totalPages={totalPages} basePath={def.basePath} />
    </div>
  );
}

export function BackToEntityList({ entity }: { entity: string }) {
  const def = ENTITIES[entity];
  return (
    <Link
      href={def.basePath}
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      Back to {def.pluralLabel}
    </Link>
  );
}
