import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { saveAppearance } from "@/lib/actions/appearance";

export const metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const rows = await prisma.siteSetting.findMany({ where: { group: "appearance" } });
  const map = new Map(rows.map((r) => [r.key, r.value || ""]));
  const v = (k: string, fallback: string) => map.get(k) || fallback;

  return (
    <div>
      <AdminPageHeader title="Appearance" description="Brand colors, radii, and global styling. Changes apply site-wide immediately." />
      <form action={saveAppearance}>
        <AdminCard title="Brand Colors">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["primaryColor", "Primary Color", "#0f2745"],
              ["secondaryColor", "Secondary Color", "#1d4ed8"],
              ["accentColor", "Accent Color", "#d97706"],
              ["textColor", "Text Color", "#111827"],
              ["mutedTextColor", "Muted Text", "#4b5563"],
              ["backgroundColor", "Background", "#f7f8fa"],
              ["surfaceColor", "Surface (Cards)", "#ffffff"],
              ["borderColor", "Border", "#e3e7ec"],
            ].map(([key, label, fallback]) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <input name={key} type="color" defaultValue={v(key, fallback)} className="h-10 w-full rounded-md border border-line p-1.5" />
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Shape" className="mt-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Button Radius</label>
              <input name="buttonRadius" defaultValue={v("buttonRadius", "0.5rem")} className="field-input" placeholder="0.5rem" />
            </div>
            <div>
              <label className="field-label">Card Radius</label>
              <input name="cardRadius" defaultValue={v("cardRadius", "0.75rem")} className="field-input" placeholder="0.75rem" />
            </div>
          </div>
        </AdminCard>
        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn btn-primary btn-lg"><Icon name="save" size={17} />Save Appearance</button>
        </div>
      </form>
    </div>
  );
}
