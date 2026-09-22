import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { saveTracking } from "@/lib/actions/appearance";

export const metadata = { title: "Tracking" };

export default async function TrackingPage() {
  const rows = await prisma.siteSetting.findMany({ where: { group: "tracking" } });
  const map = new Map(rows.map((r) => [r.key, r.value || ""]));
  const v = (k: string) => map.get(k) || "";
  return (
    <div>
      <AdminPageHeader title="Tracking & Analytics" description="Connect Google Analytics, Tag Manager, Meta Pixel, and custom scripts." />
      <form action={saveTracking}>
        <AdminCard title="Analytics">
          <div className="grid gap-5">
            <div><label className="field-label">Google Analytics (GA4 Measurement ID)</label><input name="googleAnalytics" defaultValue={v("googleAnalytics")} className="field-input" placeholder="G-XXXXXXXX" /></div>
            <div><label className="field-label">Google Tag Manager ID</label><input name="googleTagManager" defaultValue={v("googleTagManager")} className="field-input" placeholder="GTM-XXXXXXX" /></div>
            <div><label className="field-label">Meta Pixel ID</label><input name="metaPixel" defaultValue={v("metaPixel")} className="field-input" placeholder="1234567890" /></div>
            <div><label className="field-label">Google Search Console Verification</label><input name="searchConsoleVerification" defaultValue={v("searchConsoleVerification")} className="field-input" placeholder="verification token" /></div>
          </div>
        </AdminCard>
        <AdminCard title="Custom Scripts" className="mt-6">
          <div className="grid gap-5">
            <div><label className="field-label">Head Scripts</label><textarea name="headScripts" rows={4} defaultValue={v("headScripts")} className="field-textarea font-mono text-xs" placeholder="<script>...</script>" /></div>
            <div><label className="field-label">Body Scripts</label><textarea name="bodyScripts" rows={4} defaultValue={v("bodyScripts")} className="field-textarea font-mono text-xs" /></div>
            <div><label className="field-label">Footer Scripts</label><textarea name="footerScripts" rows={4} defaultValue={v("footerScripts")} className="field-textarea font-mono text-xs" /></div>
          </div>
        </AdminCard>
        <div className="mt-6 flex justify-end"><button type="submit" className="btn btn-primary btn-lg"><Icon name="save" size={17} />Save Tracking</button></div>
      </form>
    </div>
  );
}
