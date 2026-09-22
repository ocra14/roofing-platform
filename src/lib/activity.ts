import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { ActivityAction } from "@prisma/client";

/**
 * Audit trail helper. Every meaningful admin mutation should call this so the
 * Activity Log can show who did what, when, and to which record.
 */
export async function logActivity(input: {
  userId?: string | null;
  action: ActivityAction;
  entity?: string;
  entityId?: string;
  summary?: string;
}) {
  let ipAddress: string | undefined;
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    ipAddress = forwarded ? forwarded.split(",")[0].trim() : headerList.get("x-real-ip") || undefined;
  } catch {
    // headers() unavailable; omit the IP.
  }

  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId || null,
        action: input.action,
        entity: input.entity || null,
        entityId: input.entityId || null,
        summary: input.summary || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch {
    // Logging must never break the parent operation.
  }
}
