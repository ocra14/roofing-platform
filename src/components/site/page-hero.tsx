import { Img } from "@/components/ui/img";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";

export function PageHero({
  title,
  eyebrow,
  description,
  crumbs,
  image,
  fallbackLabel,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string | null;
  crumbs?: Crumb[];
  image?: string | null;
  fallbackLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      {crumbs?.length ? <Breadcrumbs items={crumbs} /> : null}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="container-page relative grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            {eyebrow ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-3 text-white">{title}</h1>
            {description ? (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{description}</p>
            ) : null}
            {children}
          </div>
          {image !== undefined ? (
            <div className="relative">
              <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20">
                <Img
                  src={image}
                  alt={title}
                  width={800}
                  height={560}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="aspect-[4/2.8] w-full object-cover"
                  fallbackLabel={fallbackLabel || title}
                  fallbackTone="blue"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
