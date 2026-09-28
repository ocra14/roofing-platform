"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * Drag-and-drop image uploader for admin forms.
 * Drops or browses a file → uploads to /api/admin/media/upload/ → writes the
 * returned URL into the hidden form field. A "paste URL" input stays available
 * as a fallback so nothing that worked before is lost.
 */
export function ImageField({
  name,
  label,
  defaultValue = "",
  placeholder = "https://… or /uploads/photo.jpg",
  helpText,
  required,
  folder = "root",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  folder?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const fieldId = `field-${name}`;

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP, GIF, AVIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("File is too large (max 8 MB).");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/media/upload/", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }
      setUrl(data.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label ? (
        <label htmlFor={fieldId} className="field-label">
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      ) : null}

      {/* Hidden value actually submitted with the form */}
      <input type="hidden" name={name} value={url} />

      {url && !url.startsWith("data:") ? (
        <>
          <div
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
              const file = e.dataTransfer.files?.[0];
              if (file) upload(file);
            }}
            className={`relative overflow-hidden rounded-xl border-2 transition-colors ${
              dragging ? "border-secondary" : "border-line"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Current image"
              className="h-44 w-full bg-canvas object-cover"
            />
            {uploading ? (
              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-white/70 text-sm font-medium text-ink">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
                Uploading…
              </span>
            ) : null}
            {dragging && !uploading ? (
              <span className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-sm font-semibold text-ink">
                Drop to replace
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn btn-outline btn-sm mt-2.5 disabled:opacity-50"
          >
            <Icon name="image" size={15} />
            {uploading ? "Uploading…" : "Replace"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </>
      ) : (
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image (drop a file or press Enter to browse)"
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
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragging
            ? "border-secondary bg-secondary/5"
            : "border-line bg-canvas/40 hover:border-secondary/50 hover:bg-canvas/70"
        }`}
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
          <Icon name="image" size={26} />
        </span>
        <span className="min-w-0 flex-1">
          {uploading ? (
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
              Uploading…
            </span>
          ) : (
            <>
              <span className="block text-sm font-semibold text-ink">
                Drop an image here or click to browse
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted">
                JPG, PNG, WebP, GIF, AVIF — max 8 MB
              </span>
            </>
          )}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
      )}

      {error ? <p className="field-error">{error}</p> : null}

      <input
        id={fieldId}
        type="text"
        value={url}
        required={required && !url}
        placeholder={placeholder}
        onChange={(e) => setUrl(e.target.value.trim())}
        className="field-input mt-2.5"
        aria-label={label ? `${label} URL` : "Image URL"}
      />

      {helpText ? <p className="mt-1.5 text-xs text-muted">{helpText}</p> : null}
    </div>
  );
}
