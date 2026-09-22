"use server";

import { prisma } from "@/lib/prisma";

export async function exportLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, include: { service: { select: { name: true } }, location: { select: { city: true } } } });
  const header = ["First Name", "Last Name", "Email", "Phone", "City", "ZIP", "Service", "Location", "Property Type", "Roof Type", "Message", "Status", "Source", "Created At"].join(",");
  const rows = leads.map((l) =>
    [l.firstName, l.lastName || "", l.email || "", l.phone || "", l.city || "", l.zipCode || "", l.service?.name || "", l.location?.city || "", l.propertyType || "", l.roofType || "", `"${(l.message || "").replace(/"/g, '""')}"`, l.status, l.source, l.createdAt.toISOString()].join(",")
  );
  return [header, ...rows].join("\n");
}

export async function createBackup() {
  // For SQLite, the database file itself is the backup. For production Postgres,
  // this would trigger pg_dump. Here we export key tables as JSON.
  const [company, services, locations, projects, leads] = await Promise.all([
    prisma.companySetting.findMany(),
    prisma.service.findMany(),
    prisma.location.findMany(),
    prisma.project.findMany(),
    prisma.lead.findMany(),
  ]);
  return JSON.stringify({ exportedAt: new Date().toISOString(), company, services, locations, projects, leads }, null, 2);
}
