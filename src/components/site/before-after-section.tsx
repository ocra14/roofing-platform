import { prisma } from "@/lib/prisma";
import { BeforeAfter } from "@/components/site/before-after";
import { placeholder } from "@/lib/utils";

/**
 * Before & After showcase. Pulls featured before/after projects from the CMS.
 * The comparison slider itself is a keyboard-accessible client component.
 */
export async function BeforeAfterSection({ limit = 3 }: { limit?: number }) {
  const projects = await prisma.project.findMany({
    where: { isEnabled: true, isBeforeAfter: true },
    orderBy: [{ isFeatured: "desc" }, { projectDate: "desc" }],
    take: limit,
    include: {
      beforeImage: { select: { url: true } },
      afterImage: { select: { url: true } },
      service: { select: { name: true } },
      location: { select: { city: true } },
    },
  });

  const featured = projects[0];
  if (!featured) return null;

  const beforeSrc = featured.beforeImage?.url || placeholder("Before", 960, 600, "stone");
  const afterSrc = featured.afterImage?.url || placeholder("After", 960, 600, "blue");

  return (
    <section className="section bg-surface" id="before-and-after">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Before &amp; After</span>
          <h2 className="mt-3">See the Difference</h2>
          <p className="lead mt-4">
            Drag the slider to view the transformation. Every project is completed by our own crews
            and documented start to finish.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BeforeAfter
              beforeSrc={beforeSrc}
              afterSrc={afterSrc}
              alt={featured.title}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="card h-full p-7">
              <span className="badge">{featured.service?.name || "Roofing"}</span>
              <h3 className="mt-4 text-lg leading-snug">{featured.title}</h3>
              {featured.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">{featured.description}</p>
              ) : null}
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
                {featured.location?.city ? (
                  <div>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted">Location</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{featured.location.city}</dd>
                  </div>
                ) : null}
                {featured.roofType ? (
                  <div>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted">Roof Type</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{featured.roofType}</dd>
                  </div>
                ) : null}
                {featured.projectSize ? (
                  <div>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted">Size</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{featured.projectSize}</dd>
                  </div>
                ) : null}
                {featured.materialsUsed ? (
                  <div>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted">Materials</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{featured.materialsUsed}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
