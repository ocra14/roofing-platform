import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { formatDate } from "@/lib/utils";

/**
 * Structural prop type - accepts any project whose relations expose the
 * minimal shape this card renders, so it works across home, service,
 * location and projects pages without re-mapping.
 */
export type ProjectWithRelations = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  projectDate?: Date | string | null;
  projectSize?: string | null;
  roofType?: string | null;
  materialsUsed?: string | null;
  isBeforeAfter?: boolean;
  service: { name: string } | null;
  location: { city: string; state?: string | null } | null;
  featuredImage?: { url: string } | null;
};

function monthYear(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const locationLine = project.location
    ? `${project.location.city}${project.location.state ? `, ${project.location.state}` : ""}`
    : null;

  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
        <Img
          src={project.featuredImage?.url ?? null}
          alt={project.title}
          width={600}
          height={450}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          fallbackLabel={project.service?.name || "Roof replacement in progress"}
          fallbackTone="stone"
        />
        {project.isBeforeAfter ? (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white">
            Before / After
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          {project.service ? <span>{project.service.name}</span> : null}
          {project.service && locationLine ? <span className="text-line">/</span> : null}
          {locationLine ? <span>{locationLine}</span> : null}
        </div>
        <h3 className="mt-2 text-base leading-snug">{project.title}</h3>
        {(project.materialsUsed || project.roofType) && (
          <p className="mt-1.5 text-[13px] font-medium text-ink/70">
            {[project.roofType, project.materialsUsed].filter(Boolean).join(" · ")}
          </p>
        )}
        {project.description ? (
          <p className="mt-2 flex-1 line-clamp-2 text-sm text-muted">{project.description}</p>
        ) : (
          <span className="flex-1" />
        )}
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
          <span className="text-xs text-muted">
            {project.projectDate
              ? `Completed ${monthYear(project.projectDate) || formatDate(project.projectDate)}`
              : project.projectSize || "—"}
            {project.projectDate && project.projectSize ? ` · ${project.projectSize}` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
            View
            <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsGrid({ projects }: { projects: ProjectWithRelations[] }) {
  if (!projects.length) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-muted">
        No projects to show yet.
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
