"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function updateLeadStatus(formData: FormData) {
  const session = await auth();
  const leadId = String(formData.get("leadId"));
  const status = String(formData.get("status"));

  const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { status: true, firstName: true, lastName: true } });
  if (!lead) throw new Error("Lead not found");

  if (lead.status !== status) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: status as any },
    });
    await logActivity({
      userId: session?.user?.id,
      action: "STATUS_CHANGE",
      entity: "Lead",
      entityId: leadId,
      summary: `${lead.firstName} ${lead.lastName || ""}: ${lead.status} → ${status}`,
    });
  }

  revalidatePath("/admin/leads/");
  revalidatePath(`/admin/leads/${leadId}/`);
  redirect(`/admin/leads/${leadId}/`);
}

export async function addLeadNote(formData: FormData) {
  const session = await auth();
  const leadId = String(formData.get("leadId"));
  const body = String(formData.get("body") || "").trim();
  const isInternal = formData.get("isInternal") === "on";

  if (!body) throw new Error("Note body is required");

  await prisma.leadNote.create({
    data: {
      leadId,
      authorId: session?.user?.id,
      body,
      isInternal,
    },
  });

  await logActivity({
    userId: session?.user?.id,
    action: "CREATE",
    entity: "LeadNote",
    entityId: leadId,
    summary: `Note added to lead`,
  });

  revalidatePath(`/admin/leads/${leadId}/`);
  redirect(`/admin/leads/${leadId}/`);
}

export async function deleteLead(formData: FormData) {
  const session = await auth();
  const leadId = String(formData.get("leadId"));

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { firstName: true, lastName: true },
  });
  if (!lead) throw new Error("Lead not found");

  await prisma.lead.delete({ where: { id: leadId } });

  await logActivity({
    userId: session?.user?.id,
    action: "DELETE",
    entity: "Lead",
    entityId: leadId,
    summary: `Deleted lead ${lead.firstName} ${lead.lastName || ""}`,
  });

  revalidatePath("/admin/leads/");
  redirect("/admin/leads/");
}
