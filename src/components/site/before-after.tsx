"use client";

import { useRef, useState, useCallback, type PointerEvent } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * Accessible before/after comparison slider.
 * Keyboard adjustable via the slider handle (left/right arrows).
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  label = "Before",
  label2 = "After",
  alt = "Roof before and after",
}: {
  beforeSrc: string;
  afterSrc: string;
  label?: string;
  label2?: string;
  alt?: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4));
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={`${alt} — before and after comparison`}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl border border-line bg-canvas"
    >
      {/* After image (full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={`${alt} - ${label2}`}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* Before image (clipped) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={`${alt} - ${label}`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current?.clientWidth ?? "100%", maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white">
        {label}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white">
        {label2}
      </span>

      {/* Handle */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 z-10 flex w-2 cursor-ew-resize items-center justify-center"
        style={{ left: `calc(${position}% - 4px)` }}
        aria-label="Adjust before and after comparison"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="slider"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-primary">
          <Icon name="chevron-down" size={18} className="rotate-90 text-primary" />
        </span>
      </button>
    </div>
  );
}
