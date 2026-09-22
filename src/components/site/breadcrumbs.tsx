import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export type Crumb = { name: string; url?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-surface">
      <div className="container-page">
        <ol className="flex items-center gap-2 overflow-x-auto py-3 text-sm">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={i} className="flex shrink-0 items-center gap-2">
                {item.url && !last ? (
                  <Link href={item.url} className="font-medium text-muted hover:text-primary">
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-primary" aria-current={last ? "page" : undefined}>
                    {item.name}
                  </span>
                )}
                {!last ? <Icon name="chevron-down" size={14} className="-rotate-90 text-line" /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
