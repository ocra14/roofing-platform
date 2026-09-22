/**
 * Switches the Prisma datasource provider between SQLite (local dev) and
 * PostgreSQL (production). Idempotent.
 *
 *   node scripts/use-postgres.mjs          -> postgresql
 *   node scripts/use-postgres.mjs sqlite   -> sqlite
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, "..", "prisma", "schema.prisma");
const target = (process.argv[2] || "postgresql").toLowerCase();

if (!["postgresql", "sqlite"].includes(target)) {
  console.error(`Unknown provider: ${target}`);
  process.exit(1);
}

let schema = readFileSync(schemaPath, "utf8");
schema = schema.replace(/provider = "(sqlite|postgresql)"/, `provider = "${target}"`);
writeFileSync(schemaPath, schema);

console.log(`Prisma provider set to "${target}" in prisma/schema.prisma`);
console.log("Next steps:");
console.log("  npm run prisma:generate");
console.log("  npx prisma migrate deploy   # or `prisma migrate dev` to create the migration");
