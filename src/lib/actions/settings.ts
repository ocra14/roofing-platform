"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function saveCompanySettings(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "company");

  const str = (k: string) => {
    const v = formData.get(k);
    return v === null || v === "" ? null : String(v).trim();
  };
  const num = (k: string) => {
    const v = formData.get(k);
    if (v === null || v === "") return null;
    const n = Number(String(v));
    return Number.isFinite(n) ? n : null;
  };
  const bool = (k: string) => formData.get(k) === "on";

  // Resolve logo/favicon URLs to Media IDs
  async function mediaIdFor(url: string | null): Promise<string | null> {
    if (!url) return null;
    const existing = await prisma.media.findFirst({ where: { url }, select: { id: true } });
    if (existing) return existing.id;
    const created = await prisma.media.create({
      data: {
        filename: url.split("/").pop() || "external",
        originalName: url.split("/").pop() || "external",
        mimeType: "image/external",
        type: "IMAGE",
        url,
        folder: "external",
      } as unknown as never,
    });
    return created.id;
  }

  const logoUrl = str("logoUrl");
  const faviconUrl = str("faviconUrl");

  const data = {
    name: str("name") || "Your Roofing Company",
    tagline: str("tagline"),
    legalName: str("legalName"),
    logoId: await mediaIdFor(logoUrl),
    faviconId: await mediaIdFor(faviconUrl),
    description: str("description"),
    phone: str("phone"),
    emergencyPhone: str("emergencyPhone"),
    email: str("email"),
    addressLine1: str("addressLine1"),
    addressLine2: str("addressLine2"),
    city: str("city"),
    state: str("state"),
    postalCode: str("postalCode"),
    businessHours: str("businessHours"),
    emergencyAvailable: bool("emergencyAvailable"),
    emergencyHoursLabel: str("emergencyHoursLabel"),
    yearsInBusiness: num("yearsInBusiness") ?? 0,
    roofsCompleted: num("roofsCompleted") ?? 0,
    googleRating: num("googleRating") ?? 0,
    reviewCount: num("reviewCount") ?? 0,
    licenseNumber: str("licenseNumber"),
    insuranceInfo: str("insuranceInfo"),
    warrantySummary: str("warrantySummary"),
    websiteUrl: str("websiteUrl"),
    googleBusinessUrl: str("googleBusinessUrl"),
    serviceAreaNote: str("serviceAreaNote"),
    socialFacebook: str("socialFacebook"),
    socialInstagram: str("socialInstagram"),
    socialX: str("socialX"),
    socialYoutube: str("socialYoutube"),
    socialLinkedin: str("socialLinkedin"),
    announcementEnabled: bool("announcementEnabled"),
    announcementText: str("announcementText"),
    announcementLabel: str("announcementLabel"),
    announcementLink: str("announcementLink"),
    announcementBg: str("announcementBg"),
  };

  await prisma.companySetting.upsert({
    where: { id },
    update: data,
    create: { id, ...data },
  });

  await logActivity({
    userId: session?.user?.id,
    action: "SETTINGS_CHANGE",
    entity: "CompanySetting",
    entityId: id,
    summary: "Updated company settings",
  });

  revalidatePath("/");
  revalidatePath("/admin/settings/");
  redirect("/admin/settings/");
}

export async function toggleDemoMode(formData: FormData) {
  const enabled = formData.get("enabled") === "on";
  await prisma.siteSetting.upsert({
    where: { key: "demoMode" },
    update: { value: enabled ? "true" : "false" },
    create: { key: "demoMode", value: enabled ? "true" : "false", group: "system" },
  });
  revalidatePath("/");
  redirect("/admin/settings/");
}
