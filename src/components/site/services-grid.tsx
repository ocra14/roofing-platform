import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon, type IconName } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { serviceImage } from "@/lib/images";

export async function ServicesGrid({
  limit,
  showHeading = true,
}: {
  limit?: number;
  showHeading?: boolean;
}) {
  const services = await prisma.service.findMany({
    where: { kind: "SERVICE", isEnabled: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    ...(limit ? { take: limit } : {}),
  });

  if (!services.length) return null;

  return (
    <section className="section" id="services">
      <div className="container-page">
        {showHeading ? (
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow">What We Do</span>
            <h2 className="mt-3">Complete Roofing Services</h2>
            <p className="lead mt-4">
              From a single leak to a full commercial re-roof, our crews handle every aspect of
              residential and commercial roofing.
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const image = serviceImage(service.slug);
            return (
              <Link
                key={service.id}
                href={`/${service.slug}/`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_12px_32px_-12px_rgba(15,39,69,0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
                  <Img
                    src={image}
                    alt={service.name}
                    width={400}
                    height={250}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    fallbackLabel={service.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-primary/5 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-md">
                    <Icon name={(service.icon as IconName) || "home"} size={16} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[15px] font-bold leading-snug tracking-[-0.01em]">{service.name}</h3>
                  {service.excerpt ? (
                    <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted line-clamp-2">
                      {service.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary">
                    Learn more
                    <Icon
                      name="arrow-right"
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
