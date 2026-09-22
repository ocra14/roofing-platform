import Link from "next/link";
import { getCompanySettings, getMenu, DEFAULT_HEADER_MENU } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";
import { MobileNav } from "@/components/site/mobile-nav";

export const CTA_LABEL = "Get a Free Estimate";
export const CTA_URL = "/free-estimate/";

export async function Header() {
  const [company, menu, services] = await Promise.all([
    getCompanySettings(),
    getMenu("header"),
    prisma.service.findMany({
      where: { kind: "SERVICE", isEnabled: true },
      orderBy: [{ order: "asc" }],
      take: 8,
      select: { name: true, slug: true },
    }),
  ]);

  const items = (menu?.items?.length ? menu.items : DEFAULT_HEADER_MENU.items).filter((i) => i.isEnabled);
  const phone = company.phone;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white shadow-[0_1px_3px_rgba(15,39,69,0.06),0_12px_32px_-16px_rgba(15,39,69,0.12)]">
      <div className="container-page flex h-[76px] items-center justify-between gap-6 lg:h-[80px] lg:gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${company.name} home`}
        >
          {company.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo.url}
              alt={`${company.name} logo`}
              className="h-10 w-auto max-w-[200px] object-contain lg:h-[44px]"
            />
          ) : (
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary text-white shadow-sm lg:h-12 lg:w-12">
                <Icon name="home" size={22} />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-[17px] font-extrabold leading-none tracking-[-0.02em] text-primary lg:text-[19px]">
                  {company.name}
                </span>
                {company.tagline ? (
                  <span className="mt-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-muted lg:text-[11px]">
                    {company.tagline}
                  </span>
                ) : null}
              </span>
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {items.map((item) => {
            const isServices = item.label.toLowerCase() === "services" && services.length > 0;
            if (isServices) {
              return (
                <div key={item.id} className="group relative">
                  <Link
                    href={item.url}
                    className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] text-ink transition-colors hover:bg-canvas hover:text-primary"
                  >
                    {item.label}
                    <Icon
                      name="chevron-down"
                      size={14}
                      className="text-muted transition-transform group-hover:rotate-180"
                    />
                  </Link>
                  {/* Dropdown */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[280px] overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_8px_32px_-8px_rgba(15,39,69,0.22)]">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/${s.slug}/`}
                          className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-canvas hover:text-primary"
                        >
                          {s.name}
                          <Icon name="arrow-right" size={13} className="text-muted" />
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-line pt-2">
                        <Link
                          href="/roofing-services/"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                          View all services
                          <Icon name="arrow-right" size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.id}
                href={item.url}
                className="rounded-lg px-3.5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] text-ink/80 transition-colors hover:bg-canvas hover:text-primary"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2 lg:gap-3">
          {phone ? (
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2.5 rounded-full border border-line bg-canvas px-4 py-2.5 transition-colors hover:border-primary/20 hover:bg-primary/[0.04] md:inline-flex"
              aria-label={`Call ${formatPhone(phone)}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                <Icon name="phone" size={13} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Call Now
                </span>
                <span className="text-[14px] font-bold tracking-[-0.01em] text-primary">
                  {formatPhone(phone)}
                </span>
              </span>
            </a>
          ) : null}

          {/* Phone icon only on small screens */}
          {phone ? (
            <a
              href={telHref(phone)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90 md:hidden"
              aria-label={`Call ${formatPhone(phone)}`}
            >
              <Icon name="phone" size={16} />
            </a>
          ) : null}

          <Link
            href={CTA_URL}
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-[13.5px] font-bold tracking-[-0.01em] text-white shadow-[0_2px_10px_rgba(217,119,6,0.35)] transition-all hover:bg-accent/90 hover:shadow-[0_4px_16px_rgba(217,119,6,0.4)] sm:inline-flex lg:px-6 lg:py-3.5 lg:text-[14px]"
          >
            {CTA_LABEL}
            <Icon name="arrow-right" size={15} className="hidden sm:inline" />
          </Link>

          <MobileNav
            items={items.map((i) => ({ id: i.id, label: i.label, url: i.url, isCTA: i.isCTA }))}
            services={services.map((s) => ({ name: s.name, slug: s.slug }))}
            phone={phone}
            phoneLabel="Call Now"
            ctaLabel={CTA_LABEL}
            ctaUrl={CTA_URL}
          />
        </div>
      </div>
    </header>
  );
}
