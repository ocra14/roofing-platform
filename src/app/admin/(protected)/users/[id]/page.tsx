import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/ui/icon";
import { saveUser } from "@/lib/actions/users";

export const metadata = { title: "Edit User" };

type Params = Promise<{ id: string }>;

export default async function UserEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const isNew = id === "new";
  const user = isNew ? null : await prisma.user.findUnique({ where: { id } });
  if (!isNew && !user) throw new Error("User not found");

  return (
    <div>
      <a href="/admin/users/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
        <Icon name="arrow-right" size={15} className="rotate-180" />Back to Users
      </a>
      <h1 className="text-2xl font-bold text-ink">{isNew ? "New User" : `Edit ${user!.name}`}</h1>
      <form action={saveUser} className="card mt-6 p-6 md:p-7">
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="field-label">Name</label><input name="name" defaultValue={user?.name || ""} required className="field-input" /></div>
          <div><label className="field-label">Email</label><input name="email" type="email" defaultValue={user?.email || ""} required className="field-input" /></div>
          <div><label className="field-label">{isNew ? "Password" : "New Password (leave blank to keep)"}</label><input name="password" type="password" required={isNew} className="field-input" /></div>
          <div>
            <label className="field-label">Role</label>
            <select name="role" defaultValue={user?.role || "EDITOR"} className="field-select">
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="EDITOR">Editor</option>
              <option value="SALES">Sales</option>
              <option value="MARKETING">Marketing</option>
            </select>
          </div>
          <label className="flex items-center gap-3 pt-1"><input type="checkbox" name="isActive" defaultChecked={user?.isActive ?? true} className="h-5 w-5 rounded border-line" /><span className="text-sm font-medium text-ink">Active</span></label>
        </div>
        <div className="mt-6 flex justify-end"><button type="submit" className="btn btn-primary btn-lg"><Icon name="save" size={17} />{isNew ? "Create User" : "Save Changes"}</button></div>
      </form>
    </div>
  );
}
