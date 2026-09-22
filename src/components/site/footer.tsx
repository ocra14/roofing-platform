import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCompanySettings, getMenu, DEFAULT_FOOTER_MENU } from "@/lib/cms";
import { Icon, type IconName } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { formatPhone, telHref, splitList } from "@/lib/utils";

export async function Footer() {
  const [company, menu, services, locations, legalPages] = await Promise.all([
    getCompanySettings(),
    getMenu("footer"),
    prisma.service.findMany({
      where: { kind: "SERVICE", isEnabled: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.location.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
      select: { id: true, city: true, state: true, slug: true },
      take: 12,
    }),
    prisma.page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true },
    }),
  ]);

  const navItems = (menu?.items?.length ? menu.items : DEFAULT_FOOTER_MENU.items).filter((i) => i.isEnabled);
  const year = new Date().getFullYear();

  const socials: { label: string; url?: string | null; icon: IconName }[] = [
    { label: "Facebook", url: company.socialFacebook, icon: "facebook" },
    { label: "Instagram", url: company.socialInstagram, icon: "instagram" },
    { label: "X", url: company.socialX, icon: "x" },
    { label: "YouTube", url: company.socialYoutube, icon: "youtube" },
    { label: "LinkedIn", url: company.socialLinkedin, icon: "linkedin" },
  ];

  const addressLines = [company.addressLine1, company.addressLine2].filter(Boolean);

  return (
    <footer className="bg-primary text-white/75" role="contentinfo">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              {company.logo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo.url} alt={`${company.name} logo`} className="h-10 w-auto" />
              ) : (
                <span className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/12 text-white">
                    <Icon name="home" size={20} />
                  </span>
                  <span className="font-display text-lg font-bold text-white">{company.name}</span>
                </span>
              )}
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {company.description || company.tagline}
            </p>

            {company.googleRating > 0 ? (
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-lg bg-white/8 px-3.5 py-2.5">
                <Stars rating={company.googleRating} size={15} />
                <span className="text-sm font-semibold text-white">{company.googleRating.toFixed(1)}</span>
                <span className="text-sm text-white/60">
                  ({company.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            ) : null}

            {socials.some((s) => s.url) ? (
              <div className="mt-6 flex items-center gap-2.5">
                {socials
                  .filter((s) => s.url)
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                      aria-label={s.label}
                    >
                      <Icon name={s.icon} size={17} />
                    </a>
                  ))}
              </div>
            ) : null}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {services.length ? (
            <div className="lg:col-span-3">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Services</h3>
              <ul className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                {services.slice(0, 10).map((s) => (
                  <li key={s.id}>
                    <Link href={`/${s.slug}/`} className="text-white/70 transition-colors hover:text-white">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Contact</h3>
            <ul className="space-y-3.5 text-sm">
              {company.phone ? (
                <li>
                  <a href={telHref(company.phone)} className="flex items-start gap-2.5 text-white/80 hover:text-white">
                    <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="font-semibold">{formatPhone(company.phone)}</span>
                  </a>
                </li>
              ) : null}
              {company.emergencyAvailable && company.emergencyPhone ? (
                <li>
                  <a href={telHref(company.emergencyPhone)} className="flex items-start gap-2.5 text-white/80 hover:text-white">
                    <Icon name="siren" size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span>
                      <span className="font-semibold">{formatPhone(company.emergencyPhone)}</span>
                      <span className="block text-white/55">{company.emergencyHoursLabel || "Emergency line"}</span>
                    </span>
                  </a>
                </li>
              ) : null}
              {company.email ? (
                <li>
                  <a href={`mailto:${company.email}`} className="flex items-start gap-2.5 text-white/80 hover:text-white">
                    <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="break-all">{company.email}</span>
                  </a>
                </li>
              ) : null}
              {addressLines.length || company.city ? (
                <li className="flex items-start gap-2.5 text-white/70">
                  <Icon name="map-pin" size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    {addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                    {[company.city, company.state, company.postalCode].filter(Boolean).join(", ")}
                  </span>
                </li>
              ) : null}
              {company.businessHours ? (
                <li className="flex items-start gap-2.5 whitespace-pre-line text-white/70">
                  <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{company.businessHours}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Service areas */}
        {locations.length ? (
          <div className="mt-12 border-t border-white/12 pt-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Service Areas</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm">
              {locations.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/service-areas/${l.slug}/`}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {`${l.city}, ${l.state}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Legal bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName || company.name}. All rights reserved.
            {company.licenseNumber ? (
              <span className="block sm:inline"> License: {company.licenseNumber}</span>
            ) : null}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalPages.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.slug}/`} className="transition-colors hover:text-white">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/" className="transition-colors hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
