"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function saveMenu(formData: FormData) {
  const session = await auth();
  const menuId = String(formData.get("menuId") || "");
  const itemsRaw = String(formData.get("items") || "");
  // items: JSON array of {label, url, order, isEnabled}
  let items: { label: string; url: string; order: number; isEnabled: boolean }[] = [];
  try { items = JSON.parse(itemsRaw); } catch { /* ignore */ }

  await prisma.menuItem.deleteMany({ where: { menuId } });
  for (const item of items) {
    if (!item.label || !item.url) continue;
    await prisma.menuItem.create({
      data: { menuId, label: item.label, url: item.url, order: item.order || 0, isEnabled: item.isEnabled !== false },
    });
  }
  await logActivity({ userId: session?.user?.id, action: "UPDATE", entity: "Menu", entityId: menuId, summary: "Updated menu" });
  revalidatePath("/");
  revalidatePath("/admin/menus/");
  redirect("/admin/menus/");
}
