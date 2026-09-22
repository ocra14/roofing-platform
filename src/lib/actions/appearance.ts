"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

const APPEARANCE_KEYS = [
  "primaryColor", "secondaryColor", "accentColor",
  "textColor", "mutedTextColor", "backgroundColor", "surfaceColor", "borderColor",
  "buttonRadius", "cardRadius",
] as const;

export async function saveAppearance(formData: FormData) {
  const session = await auth();
  for (const key of APPEARANCE_KEYS) {
    const value = String(formData.get(key) || "").trim();
    if (!value) continue;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, group: "appearance" },
      create: { key, value, group: "appearance" },
    });
  }
  await logActivity({
    userId: session?.user?.id,
    action: "SETTINGS_CHANGE",
    entity: "Appearance",
    summary: "Updated appearance settings",
  });
  revalidatePath("/");
  revalidatePath("/admin/appearance/");
  redirect("/admin/appearance/");
}

export async function saveTracking(formData: FormData) {
  const session = await auth();
  const keys = ["googleAnalytics", "googleTagManager", "searchConsoleVerification", "metaPixel", "headScripts", "bodyScripts", "footerScripts"];
  for (const key of keys) {
    const value = String(formData.get(key) || "");
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, group: "tracking" },
      create: { key, value, group: "tracking" },
    });
  }
  await logActivity({
    userId: session?.user?.id,
    action: "SETTINGS_CHANGE",
    entity: "Tracking",
    summary: "Updated tracking settings",
  });
  revalidatePath("/admin/tracking/");
  redirect("/admin/tracking/");
}
