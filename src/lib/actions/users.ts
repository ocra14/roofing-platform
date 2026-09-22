"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function saveUser(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "");
  const isNew = id === "new" || !id;
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "EDITOR") as any;
  const isActive = formData.get("isActive") === "on";

  if (!name || !email) throw new Error("Name and email are required");

  if (isNew) {
    if (!password) throw new Error("Password is required for new users");
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash, role, isActive },
    });
    await logActivity({ userId: session?.user?.id, action: "CREATE", entity: "User", entityId: user.id, summary: `Created user ${email}` });
  } else {
    const data: Record<string, unknown> = { name, email, role, isActive };
    if (password) data.passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id }, data });
    await logActivity({ userId: session?.user?.id, action: "UPDATE", entity: "User", entityId: id, summary: `Updated user ${email}` });
  }
  revalidatePath("/admin/users/");
  redirect("/admin/users/");
}

export async function deleteUser(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "");
  await prisma.user.delete({ where: { id } });
  await logActivity({ userId: session?.user?.id, action: "DELETE", entity: "User", entityId: id, summary: "Deleted user" });
  revalidatePath("/admin/users/");
  redirect("/admin/users/");
}
