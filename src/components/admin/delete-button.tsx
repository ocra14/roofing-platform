"use client";

import { useTransition } from "react";
import { Icon } from "@/components/ui/icon";

export function DeleteRecordButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) return;
        startTransition(() => {
          action();
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Icon name="trash" size={15} />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
