import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiting (per IP, per minute).
// For multi-instance production deployments, back this with Redis or similar.
// ---------------------------------------------------------------------------
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a moment." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const formSlug = String(body.__formSlug || "free-estimate").trim();

  // ---------------------------------------------------------------------------
  // Spam protection:
  //  - honeypot field must be empty;
  //  - the form must have been open for at least 2 seconds (bots submit
  //    instantly). A negative elapsed time means the client clock is skewed,
  //    which is not evidence of spam, so we only block a small POSITIVE gap.
  // ---------------------------------------------------------------------------
  const honeypot = String(body.website || "");
  const startedAt = Number(body.__t0 || 0);
  if (honeypot) {
    // Pretend success so bots don't retry.
    return NextResponse.json({ ok: true });
  }
  const elapsed = Number.isFinite(startedAt) ? Date.now() - startedAt : NaN;
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 2000) {
    return NextResponse.json({ ok: true });
  }

  const form = await prisma.form.findUnique({
    where: { slug: formSlug },
    include: { fields: { where: { isEnabled: true }, orderBy: { order: "asc" } } },
  });

  if (!form || !form.isEnabled) {
    return NextResponse.json({ ok: false, error: "This form is not available." }, { status: 404 });
  }

  // ---------------------------------------------------------------------------
  // Validate required fields server-side.
  // ---------------------------------------------------------------------------
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const field of form.fields) {
    const raw = body[field.name];
    const isEmpty =
      raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "");

    if (field.required && isEmpty) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (isEmpty) {
      values[field.name] = "";
      continue;
    }

    const str = typeof raw === "string" ? raw.trim() : String(raw);

    // Type sanity checks
    if (field.type === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
      errors[field.name] = "Please enter a valid email address.";
      continue;
    }
    if (field.type === "PHONE" && str.replace(/\D/g, "").length < 10) {
      errors[field.name] = "Please enter a valid phone number.";
      continue;
    }
    if (field.type === "SELECT" && field.options) {
      const opts = Array.isArray(field.options) ? (field.options as string[]) : [];
      if (opts.length && !opts.includes(str)) {
        errors[field.name] = "Please choose one of the available options.";
        continue;
      }
    }
    if (str.length > 5000) {
      errors[field.name] = "This response is too long.";
      continue;
    }
    values[field.name] = str;
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // ---------------------------------------------------------------------------
  // Resolve relational fields (serviceId by name, locationId by slug).
  // ---------------------------------------------------------------------------
  let serviceId: string | null = null;
  if (values.serviceId) {
    const service = await prisma.service.findFirst({
      where: { OR: [{ name: values.serviceId }, { slug: slugify(values.serviceId) }] },
      select: { id: true },
    });
    serviceId = service?.id ?? null;
  }
  let locationId: string | null = null;
  if (values.city) {
    const location = await prisma.location.findFirst({
      where: { OR: [{ city: values.city }, { slug: slugify(values.city) }] },
      select: { id: true },
    });
    locationId = location?.id ?? null;
  }

  const firstName = values.firstName || values.name || "Website";
  const lastName = values.lastName || "";

  if (form.createLead) {
    await prisma.lead.create({
      data: {
        formId: form.id,
        firstName,
        lastName: lastName || null,
        email: values.email || null,
        phone: values.phone || null,
        city: values.city || null,
        zipCode: values.zipCode || null,
        serviceId,
        locationId,
        propertyType: values.propertyType || null,
        roofType: values.roofType || null,
        message: values.message || null,
        preferredContact: values.preferredContact || null,
        appointmentDate: values.appointmentDate ? new Date(values.appointmentDate) : null,
        source: form.leadSource,
        status: "NEW",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    message: form.successMessage || "Thank you! We'll be in touch shortly.",
    redirectUrl: form.redirectUrl || null,
  });
}
