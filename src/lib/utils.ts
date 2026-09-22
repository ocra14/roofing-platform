import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Slugify a string for URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Absolute site URL helper. */
export function siteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
}

/** Format a phone number for display: (214) 555-0177 */
export function formatPhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1"))
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

/** tel: href */
export function telHref(phone?: string | null): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits ? `tel:+1${digits}` : "#";
}

/** Format an ISO date for display. */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Truncate text for excerpts. */
export function excerptify(text: string, length = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}…`;
}

/** Star rating -> array for rendering. */
export function starArray(rating: number): ("full" | "half" | "empty")[] {
  return Array.from({ length: 5 }, (_, i) => {
    const v = rating - i;
    if (v >= 1) return "full";
    if (v >= 0.5) return "half";
    return "empty";
  });
}

/** Parse a comma-separated list into a clean array. */
export function splitList(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse a JSON field that may be null/corrupt into a typed array. */
export function asJsonArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

/** Generate a placeholder SVG data URL for missing imagery (demo only). */
export function placeholder(label: string, w = 1200, h = 800, tone = "slate"): string {
  const colors: Record<string, [string, string]> = {
    slate: ["#1e293b", "#0f172a"],
    blue: ["#1d4ed8", "#0c1d54"],
    amber: ["#b45309", "#3b2406"],
    stone: ["#44403c", "#1c1917"],
  };
  const [c1, c2] = colors[tone] || colors.slate;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="50%" y="50%" fill="rgba(255,255,255,0.55)" font-family="system-ui,sans-serif" font-size="${Math.round(w / 24)}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(label)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
