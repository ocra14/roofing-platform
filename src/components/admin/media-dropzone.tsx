"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

/**
 * Drag-and-drop uploader for the Media Library.
 * Uploads straight to /api/admin/media/upload/ and refreshes the grid.
 */
export function MediaDropzone() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setError("Please choose image files (JPG, PNG, WebP, GIF, AVIF).");
      return;
    }
    setError(null);
    let succeeded = 0;
    for (const file of list) {
      if (file.size > 8 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 8 MB) — skipped.`);
        continue;
      }
      setUploading(file.name);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "root");
        const res = await fetch("/api/admin/media/upload/", { method: "POST", body: form });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (data.ok) succeeded += 1;
        else setError(data.error || `Failed to upload "${file.name}".`);
      } catch {
        setError(`Failed to upload "${file.name}". Check your connection.`);
      }
    }
    setUploading(null);
    if (succeeded > 0) {
      setDone((n) => n + succeeded);
      router.refresh();
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images (drop files or press Enter to browse)"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          dragCount.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCount.current = Math.max(0, dragCount.current - 1);
          if (dragCount.current === 0) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragCount.current = 0;
          setDragging(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-secondary bg-secondary/5"
            : "border-line bg-canvas/40 hover:border-secondary/50 hover:bg-canvas/70"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
          <Icon name="image" size={22} />
        </span>
        {uploading ? (
          <span className="flex items-center gap-2 text-sm font-medium text-ink">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
            Uploading {uploading}…
          </span>
        ) : (
          <>
            <span className="text-sm font-semibold text-ink">
              Drop images here or click to browse
            </span>
            <span className="text-xs text-muted">JPG, PNG, WebP, GIF, AVIF — max 8 MB each. You can drop multiple files.</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="field-error mt-2">{error}</p> : null}
      {done > 0 && !uploading && !error ? (
        <p className="mt-2 text-xs font-medium text-emerald-700">{done} image(s) uploaded.</p>
      ) : null}
    </div>
  );
}
