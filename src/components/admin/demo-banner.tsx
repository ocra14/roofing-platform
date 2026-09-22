import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/ui/icon";

/**
 * Shows a notice whenever demo content is active, so the business owner is
 * always aware that seeded placeholder data must be replaced before launch.
 */
export async function DemoBanner() {
  let demoMode = false;
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "demoMode" } });
    demoMode = row?.value === "true";
  } catch {
    // Settings table unavailable; fail silently.
  }

  if (!demoMode) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950">
      <Icon name="alert" size={16} className="shrink-0" />
      <span>
        Demo content is active. Replace the sample company information, reviews, and projects in
        Admin before going live.
      </span>
    </div>
  );
}
