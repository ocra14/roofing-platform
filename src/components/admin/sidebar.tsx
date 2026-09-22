"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import type { SystemRole } from "@prisma/client";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  roles: SystemRole[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL: SystemRole[] = ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR", "SALES", "MARKETING"];

const GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/", icon: "chart", roles: ALL }],
  },
  {
    label: "Lead Management",
    items: [
      { label: "Leads", href: "/admin/leads/", icon: "send", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "SALES"] },
      { label: "Forms", href: "/admin/forms/", icon: "file", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "MARKETING"] },
    ],
  },
  {
    label: "Website Content",
    items: [
      { label: "Services", href: "/admin/services/", icon: "wrench", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Service Areas", href: "/admin/locations/", icon: "map-pin", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Projects", href: "/admin/projects/", icon: "home", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Before & After", href: "/admin/before-after/", icon: "image", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Reviews", href: "/admin/reviews/", icon: "star", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Team", href: "/admin/team/", icon: "user", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "FAQs", href: "/admin/faqs/", icon: "alert", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"] },
      { label: "Blog", href: "/admin/blog/", icon: "edit", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR", "MARKETING"] },
      { label: "Offers", href: "/admin/offers/", icon: "badge", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "MARKETING"] },
      { label: "Financing", href: "/admin/financing/", icon: "badge", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Company Settings", href: "/admin/settings/", icon: "settings", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Appearance", href: "/admin/appearance/", icon: "palette", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Menus", href: "/admin/menus/", icon: "menu", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Media Library", href: "/admin/media/", icon: "image", roles: ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR", "MARKETING"] },
      { label: "SEO", href: "/admin/seo/", icon: "search", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Tracking", href: "/admin/tracking/", icon: "chart", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Redirects", href: "/admin/redirects/", icon: "link", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users", href: "/admin/users/", icon: "user", roles: ["SUPER_ADMIN"] },
      { label: "Activity Log", href: "/admin/activity/", icon: "clock", roles: ["SUPER_ADMIN", "ADMINISTRATOR"] },
      { label: "Backups", href: "/admin/backups/", icon: "download", roles: ["SUPER_ADMIN"] },
    ],
  },
];

const ROLE_LABEL: Record<SystemRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMINISTRATOR: "Administrator",
  EDITOR: "Editor",
  SALES: "Sales",
  MARKETING: "Marketing",
};

export function AdminSidebar({
  companyName,
  role,
  userName,
  email,
}: {
  companyName: string;
  role: SystemRole;
  userName: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const visibleGroups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length);

  const content = (
    <div className="flex h-full flex-col bg-primary text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/12 px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/12">
          <Icon name="home" size={18} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold text-white">{companyName}</span>
          <span className="block text-[0.6875rem] text-white/50">Admin Dashboard</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2.5 px-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white/40">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} size={17} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/12 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 font-display text-sm font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">{userName}</span>
            <span className="block truncate text-xs text-white/50">{email}</span>
          </span>
        </div>
        <p className="mt-3 px-1 text-[0.6875rem] font-medium uppercase tracking-wide text-white/40">
          {ROLE_LABEL[role]}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-50 inline-flex items-center justify-center rounded-lg bg-primary p-2 text-white shadow-lg lg:hidden"
        aria-label="Open admin menu"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 lg:block">{content}</aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-2xl">{content}</div>
        </div>
      ) : null}
    </>
  );
}
