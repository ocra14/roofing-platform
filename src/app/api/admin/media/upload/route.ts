import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { auth, can } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";
import type { SystemRole } from "@prisma/client";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * POST /api/admin/media/upload/
 * Multipart form: file (required), folder (optional), altText (optional).
 * Admin-only: requires content:write or blog:write. Validates type + size,
 * sanitizes the filename, stores under UPLOADS_DIR, and registers a Media row.
 */
export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: SystemRole } | undefined)?.role;
  if (!session?.user || (!can(role, "content:write") && !can(role, "blog:write"))) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }

  const ext = ALLOWED_MIME[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, WebP, GIF, and AVIF images are allowed." },
      { status: 400 }
    );
  }
  if (file.size <= 0) {
    return NextResponse.json({ ok: false, error: "Empty file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is too large (max 8 MB)." }, { status: 413 });
  }

  const folder = slugify(String(form.get("folder") || "root")).replace(/-/g, "") || "root";
  const altText = String(form.get("altText") || "").trim().slice(0, 300) || null;

  // Sanitize: slug base + timestamp + validated extension. Never trust client name.
  const base = slugify(file.name.replace(/\.[a-z0-9]+$/i, "")).slice(0, 60) || "upload";
  const filename = `${Date.now()}-${base}.${ext}`;

  const uploadsDir = process.env.UPLOADS_DIR || "public/uploads";
  const absoluteDir = resolve(process.cwd(), uploadsDir, folder);
  const publicBase = uploadsDir.replace(/^\/?public\/?/, "").replace(/^\/+/, "");
  const publicDir = publicBase ? `/${publicBase}` : "";

  // Containment: resolved path must stay inside the uploads root.
  const root = resolve(process.cwd(), uploadsDir);
  if (!absoluteDir.startsWith(root + sep) && absoluteDir !== root) {
    return NextResponse.json({ ok: false, error: "Invalid folder." }, { status: 400 });
  }

  try {
    await mkdir(absoluteDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(absoluteDir, filename), bytes);

    const url = `${publicDir}/${folder}/${filename}`.replace(/\/{2,}/g, "/");
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name.slice(0, 200),
        mimeType: file.type,
        size: file.size,
        type: "IMAGE",
        url,
        altText,
        folder,
      } as unknown as never,
    });

    await logActivity({
      userId: (session.user as { id?: string })?.id,
      action: "CREATE",
      entity: "Media",
      entityId: media.id,
      summary: `Uploaded ${filename}`,
    });

    return NextResponse.json({ ok: true, url, id: media.id });
  } catch (e) {
    console.error("Media upload failed:", e);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
