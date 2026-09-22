import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon, type IconName } from "@/components/ui/icon";

export async function MaterialsGrid({ limit }: { limit?: number }) {
  const materials = await prisma.service.findMany({
    where: { kind: "MATERIAL", isEnabled: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    ...(limit ? { take: limit } : {}),
    select: { id: true, name: true, slug: true, excerpt: true, icon: true },
  });

  if (!materials.length) return null;

  return (
    <section className="section" id="materials">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Roofing Materials</span>
          <h2 className="mt-3">Choose the Right Material</h2>
          <p className="lead mt-4">
            Every material has trade-offs in cost, lifespan, and suitability. We help you compare
            honestly so you can choose what fits your home and budget.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((m) => (
            <Link
              key={m.id}
              href={`/${m.slug}/`}
              className="card card-hover group flex flex-col p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon name={(m.icon as IconName) || "layer"} size={22} />
              </span>
              <h3 className="mt-5 text-base">{m.name}</h3>
              {m.excerpt ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{m.excerpt}</p>
              ) : null}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                Material guide
                <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
