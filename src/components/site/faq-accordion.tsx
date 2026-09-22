"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

export type FaqItem = { id: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-muted">
        No frequently asked questions yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-canvas/60"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              id={`faq-question-${item.id}`}
            >
              <span className="text-base font-semibold text-ink">{item.question}</span>
              <Icon
                name="chevron-down"
                size={19}
                aria-hidden="true"
                className={`shrink-0 text-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              hidden={!isOpen}
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
            >
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
