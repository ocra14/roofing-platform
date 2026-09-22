"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import type { FormField } from "@prisma/client";

export type DynamicFormProps = {
  formSlug: string;
  fields: FormField[];
  submitLabel: string;
  successMessage?: string | null;
  redirectUrl?: string | null;
  className?: string;
};

export function DynamicForm({
  formSlug,
  fields,
  submitLabel,
  successMessage,
  redirectUrl,
  className,
}: DynamicFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const visible = fields.filter((f) => f.isEnabled && f.type !== "HIDDEN");
  const [t0, setT0] = useState<number | null>(null);
  useEffect(() => setT0(Date.now()), []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setErrors({});
    setServerError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      __formSlug: formSlug,
      __t0: Number(formData.get("__t0") || 0),
      website: String(formData.get("website") || ""),
    };

    for (const field of visible) {
      const value = formData.get(field.name);
      payload[field.name] = value instanceof File ? value.name : (value as string) ?? "";
    }

    let res: Response;
    try {
      res = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setSubmitting(false);
      setServerError("Something went wrong. Please call us instead.");
      return;
    }

    setSubmitting(false);

    if (res.status === 429) {
      setServerError("You've submitted several requests. Please wait a minute and try again.");
      return;
    }

    let data: { ok: boolean; errors?: Record<string, string>; error?: string; message?: string; redirectUrl?: string | null };
    try {
      data = await res.json();
    } catch {
      setServerError("Unexpected response from the server.");
      return;
    }

    if (!data.ok) {
      if (data.errors) setErrors(data.errors);
      else setServerError(data.error || "Please check your information and try again.");
      return;
    }

    setDone(true);
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  }

  if (done) {
    return (
      <div className={`card border-emerald-200 bg-emerald-50 p-8 text-center ${className || ""}`}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Icon name="check" size={28} />
        </span>
        <h3 className="mt-5 text-lg text-emerald-900">Thank you!</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-emerald-800">
          {successMessage || "We've received your request and will call you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className} aria-label={submitLabel}>
      {/* Honeypot: invisible to humans, tempting to bots. */}
      <div className="hidden" aria-hidden="true" suppressHydrationWarning>
        <label htmlFor="website">Website (leave blank)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="__t0" value={t0 ?? ""} readOnly suppressHydrationWarning />

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((field) => {
          const isFull = field.width !== "half";
          const error = errors[field.name];
          const inputId = `field-${field.name}`;
          const describedBy = error ? `${inputId}-error` : field.helpText ? `${inputId}-help` : undefined;

          return (
            <div key={field.id} className={isFull ? "sm:col-span-2" : ""}>
              <label htmlFor={inputId} className="field-label">
                {field.label}
                {field.required ? <span className="ml-0.5 text-red-600" aria-hidden="true">*</span> : null}
              </label>

              {field.type === "TEXTAREA" ? (
                <textarea
                  id={inputId}
                  name={field.name}
                  rows={4}
                  required={field.required}
                  placeholder={field.placeholder || undefined}
                  aria-invalid={!!error}
                  aria-describedby={describedBy}
                  className="field-textarea"
                />
              ) : field.type === "SELECT" ? (
                <select
                  id={inputId}
                  name={field.name}
                  required={field.required}
                  aria-invalid={!!error}
                  aria-describedby={describedBy}
                  className="field-select"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {field.placeholder || "Select an option…"}
                  </option>
                  {(field.options as string[] | null)?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={inputId}
                  name={field.name}
                  type={field.type === "PHONE" ? "tel" : field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : field.type === "DATE" ? "date" : "text"}
                  required={field.required}
                  placeholder={field.placeholder || undefined}
                  autoComplete="on"
                  aria-invalid={!!error}
                  aria-describedby={describedBy}
                  className="field-input"
                />
              )}

              {field.helpText && !error ? (
                <p id={`${inputId}-help`} className="mt-1.5 text-xs text-muted">
                  {field.helpText}
                </p>
              ) : null}
              {error ? (
                <p id={`${inputId}-error`} className="field-error">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {serverError ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
          <Icon name="alert" size={17} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              <Icon name="send" size={17} />
              {submitLabel}
            </>
          )}
        </button>
        <p className="text-xs text-muted">
          We respect your privacy. Your information is used only to respond to your request.
        </p>
      </div>
    </form>
  );
}
