import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Internal redirect lookup — called by `src/middleware.ts` (edge) so the
 * database query runs on the Node runtime. Not for public use.
 */
export async function GET(request: Request) {
  // Only allow internal middleware lookups
  const isInternal = request.headers.get("x-middleware-lookup") === "1";
  if (!isInternal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({});

  try {
    const rule = await prisma.redirect.findFirst({
      where: { fromUrl: path, isActive: true },
      select: { toUrl: true, type: true },
    });
    if (rule) return NextResponse.json({ toUrl: rule.toUrl, type: rule.type });
  } catch {
    // DB unavailable
  }
  return NextResponse.json({});
}
