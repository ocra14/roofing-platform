"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function uploadMedia(formData: FormData) {
  const session = await auth();
  const url = String(formData.get("url") || "").trim();
  const altText = String(formData.get("altText") || "").trim() || null;
  const folder = String(formData.get("folder") || "root").trim() || "root";
  if (!url) throw new Error("URL is required");
  const filename = url.split("/").pop() || "file";
  await prisma.media.create({
    data: {
      filename,
      originalName: filename,
      mimeType: "image/*",
      type: "IMAGE",
      url,
      altText,
      folder,
    } as unknown as never,
  });
  await logActivity({ userId: session?.user?.id, action: "CREATE", entity: "Media", summary: `Added media ${filename}` });
  revalidatePath("/admin/media/");
  redirect("/admin/media/");
}

export async function deleteMedia(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "");
  await prisma.media.delete({ where: { id } });
  await logActivity({ userId: session?.user?.id, action: "DELETE", entity: "Media", entityId: id, summary: "Deleted media" });
  revalidatePath("/admin/media/");
  redirect("/admin/media/");
}

export async function saveBlogPost(formData: FormData) {
  const session = await auth();
  const id = String(formData.get("id") || "");
  const isNew = id === "new" || !id;
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const content = String(formData.get("content") || "").trim();
  const status = String(formData.get("status") || "DRAFT") as any;
  const categoryId = String(formData.get("categoryId") || "").trim() || null;
  if (!title || !slug || !content) throw new Error("Title, slug, and content are required");

  const data = { title, slug, excerpt, content, status, categoryId, authorId: session?.user?.id || null, publishedAt: status === "PUBLISHED" ? new Date() : null };
  if (isNew) {
    const post = await prisma.blogPost.create({ data });
    await logActivity({ userId: session?.user?.id, action: "CREATE", entity: "BlogPost", entityId: post.id, summary: `Created post ${title}` });
  } else {
    await prisma.blogPost.update({ where: { id }, data });
    await logActivity({ userId: session?.user?.id, action: "UPDATE", entity: "BlogPost", entityId: id, summary: `Updated post ${title}` });
  }
  revalidatePath("/admin/blog/");
  revalidatePath("/blog/");
  redirect("/admin/blog/");
}

export async function deleteBlogPost(formData: FormData) {
  const id = String(formData.get("id") || "");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog/");
  redirect("/admin/blog/");
}
