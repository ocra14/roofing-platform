"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";
import { ENTITIES, type FieldDef } from "@/lib/admin/entities";
import { slugify } from "@/lib/utils";

/**
 * Converts a raw form value into the shape Prisma expects, based on the field
 * definition. JSON-style fields (list / pipeList) are parsed into structured
 * arrays so the frontend renders them without any further interpretation.
 */
function castValue(field: FieldDef, raw: FormDataEntryValue | null): unknown {
  switch (field.type) {
    case "checkbox":
      return raw === "on";
    case "number": {
      if (raw === null || raw === "") return null;
      const n = Number(String(raw));
      return Number.isFinite(n) ? n : null;
    }
    case "list": {
      if (raw === null) return [];
      return String(raw)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }
    case "pipeList": {
      if (raw === null) return [];
      const [a, b] = field.keys || ["a", "b"];
      return String(raw)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [first, ...rest] = line.split("|");
          return { [a]: first.trim(), [b]: rest.join("|").trim() };
        });
    }
    case "date":
      if (!raw) return null;
      // Normalize to UTC midnight so display formatting is stable.
      return new Date(String(raw) + "T00:00:00.000Z");
    default:
      return raw === null ? null : String(raw);
  }
}

/**
 * Some entities keep relational image columns (e.g. projects.beforeImageId)
 * while the admin form edits a friendly `beforeImageUrl` field. This maps the
 * friendly names onto their relational counterparts after resolving the Media
 * row, keeping the admin UI simple without orphaning FK constraints.
 */
const URL_TO_MEDIA: Record<string, string> = {
  beforeImageUrl: "beforeImageId",
  afterImageUrl: "afterImageId",
  featuredImageUrl: "featuredImageId",
  imageUrl: "imageId",
  photoUrl: "photoMediaId",
};

async function resolveMediaUrls(
  model: string,
  values: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const out = { ...values };
  for (const [formKey, column] of Object.entries(URL_TO_MEDIA)) {
    if (!(formKey in out)) continue;
    const url = String(out[formKey] || "").trim();
    delete out[formKey];

    if (!url) {
      out[column] = null;
      continue;
    }
    const media = await prisma.media.findFirst({
      where: { OR: [{ url }, { originalName: url }] },
      select: { id: true },
    });
    out[column] = media?.id ?? null;
    if (!media) {
      // Auto-register an external URL as a media record so it remains
      // traceable in the library and the FK stays satisfied.
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
      out[column] = created.id;
    }
  }
  return out;
}

export async function saveRecord(entity: string, id: string | null, formData: FormData) {
  const session = await auth();
  const def = ENTITIES[entity];
  if (!def) throw new Error(`Unknown entity: ${entity}`);

  const values: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.type === "select" && formData.get(field.name) === "") {
      values[field.name] = null;
      continue;
    }
    values[field.name] = castValue(field, formData.get(field.name));
  }

  // Ensure slugs are URL-safe and unique-ish.
  if ("slug" in values && values.slug) {
    values.slug = slugify(String(values.slug));
  }

  const resolved = await resolveMediaUrls(def.model, values);
  // Never persist helper keys that don't exist as columns.
  for (const key of Object.keys(URL_TO_MEDIA)) delete resolved[key];

  const delegate = (prisma as unknown as Record<string, {
    upsert: (a: unknown) => Promise<{ id: string }>;
    delete: (a: unknown) => Promise<unknown>;
  }>)[def.model];

  if (!delegate) throw new Error(`Unknown model: ${def.model}`);

  const isNew = id === "new" || !id;
  const record = await delegate.upsert({
    where: { id: isNew ? "__nonexistent__" : id },
    update: resolved,
    create: resolved,
  });

  await logActivity({
    userId: session?.user?.id,
    action: isNew ? "CREATE" : "UPDATE",
    entity: def.label,
    entityId: record.id,
    summary: `${isNew ? "Created" : "Updated"} ${def.label.toLowerCase()}`,
  });

  revalidatePath(def.basePath);
  revalidatePath("/");
  redirect(def.basePath);
}

export async function deleteRecord(entity: string, id: string) {
  const session = await auth();
  const def = ENTITIES[entity];
  if (!def) throw new Error(`Unknown entity: ${entity}`);

  const delegate = (prisma as unknown as Record<string, { delete: (a: unknown) => Promise<unknown> }>)[def.model];
  if (!delegate) throw new Error(`Unknown model: ${def.model}`);

  try {
    await delegate.delete({ where: { id } });
  } catch {
    // Record may already be gone or referenced; fail softly in the UI.
  }

  await logActivity({
    userId: session?.user?.id,
    action: "DELETE",
    entity: def.label,
    entityId: id,
    summary: `Deleted ${def.label.toLowerCase()}`,
  });

  revalidatePath(def.basePath);
  revalidatePath("/");
  redirect(def.basePath);
}
