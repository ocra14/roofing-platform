"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";

type Item = { id: string; label: string; url: string; isCTA: boolean };
type ServiceLink = { name: string; slug: string };

export function MobileNav({
  items,
  services,
  phone,
  phoneLabel,
  ctaLabel,
  ctaUrl,
}: {
  items: Item[];
  services?: ServiceLink[];
  phone?: string | null;
  phoneLabel?: string;
  ctaLabel?: string;
  ctaUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-colors hover:bg-canvas xl:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Icon name="menu" size={20} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-[380px] flex-col bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-canvas"
                aria-label="Close menu"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
              {/* Primary CTAs */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                {phone ? (
                  <a
                    href={telHref(phone)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-canvas px-4 py-3 text-[13px] font-bold text-primary"
                  >
                    <Icon name="phone" size={14} />
                    {phoneLabel || formatPhone(phone)}
                  </a>
                ) : null}
                {ctaLabel && ctaUrl ? (
                  <a
                    href={ctaUrl}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-3 text-[13px] font-bold text-white shadow-sm"
                  >
                    {ctaLabel}
                    <Icon name="arrow-right" size={13} />
                  </a>
                ) : null}
              </div>

              <ul className="flex flex-col">
                {items.map((item) => {
                  const isServices = item.label.toLowerCase() === "services" && services && services.length > 0;
                  if (isServices) {
                    return (
                      <li key={item.id} className="border-b border-line/60">
                        <button
                          type="button"
                          onClick={() => setServicesOpen((v) => !v)}
                          className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-ink"
                          aria-expanded={servicesOpen}
                        >
                          {item.label}
                          <Icon
                            name="chevron-down"
                            size={16}
                            className={`text-muted transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {servicesOpen ? (
                          <ul className="mb-3 ml-1 space-y-0.5 border-l-2 border-accent/20 pl-4">
                            {services!.map((s) => (
                              <li key={s.slug}>
                                <a
                                  href={`/${s.slug}/`}
                                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-ink/80 transition-colors hover:bg-canvas hover:text-primary"
                                >
                                  {s.name}
                                  <Icon name="arrow-right" size={12} className="text-muted" />
                                </a>
                              </li>
                            ))}
                            <li>
                              <a
                                href="/roofing-services/"
                                className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-[13px] font-semibold text-white"
                              >
                                View all services
                                <Icon name="arrow-right" size={12} />
                              </a>
                            </li>
                          </ul>
                        ) : null}
                      </li>
                    );
                  }
                  return (
                    <li key={item.id} className="border-b border-line/60">
                      <a
                        href={item.url}
                        className="flex items-center justify-between py-4 text-[15px] font-semibold text-ink transition-colors hover:text-primary"
                      >
                        {item.label}
                        <Icon name="arrow-right" size={14} className="text-muted" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Trust footer in drawer */}
              <div className="mt-auto border-t border-line pt-6">
                <div className="flex items-center gap-2 text-xs font-medium text-muted">
                  <Icon name="shield" size={13} className="text-accent" />
                  Licensed & Insured
                  <span className="text-line">·</span>
                  <Icon name="badge" size={13} className="text-accent" />
                  Certified Installers
                </div>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
