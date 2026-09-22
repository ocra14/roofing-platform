import { prisma } from "@/lib/prisma";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { saveMenu } from "@/lib/actions/menus";

export const metadata = { title: "Menus" };

export default async function MenusPage() {
  const menus = await prisma.menu.findMany({ include: { items: { orderBy: { order: "asc" } } }, orderBy: { slug: "asc" } });
  return (
    <div>
      <AdminPageHeader title="Navigation Menus" description="Control header, footer, and mobile navigation links." />
      {menus.map((menu) => (
        <form key={menu.id} action={saveMenu} className="card mb-6 p-6 md:p-7">
          <input type="hidden" name="menuId" value={menu.id} />
          <h2 className="text-lg font-bold text-ink capitalize">{menu.name} <span className="text-sm font-normal text-muted">({menu.slug})</span></h2>
          <p className="mt-1 text-sm text-muted">Edit as JSON array of {"{ label, url, order, isEnabled }"}. Example: [{`"`}label{`"`}:{`"`}Services{`"`},{`"`}url{`"`}:{`"`}/roofing-services/{`"`}]</p>
          <textarea name="items" rows={8} defaultValue={JSON.stringify(menu.items.map((i) => ({ label: i.label, url: i.url, order: i.order, isEnabled: i.isEnabled })), null, 2)} className="field-textarea mt-4 font-mono text-xs" />
          <div className="mt-4 flex justify-end"><button type="submit" className="btn btn-primary"><Icon name="save" size={16} />Save {menu.name}</button></div>
        </form>
      ))}
      {menus.length === 0 ? <AdminCard title="No menus"><p className="text-sm text-muted">Menus will be created when you seed the database. Run <code>npm run db:seed</code>.</p></AdminCard> : null}
    </div>
  );
}
