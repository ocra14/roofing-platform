import { Icon, type IconName } from "@/components/ui/icon";
import { asJsonArray } from "@/lib/utils";

type Step = { title: string; description: string };

/**
 * Renders a CMS-managed process list (service.process or a default 6-step
 * roofing process). Order and content come from the database.
 */
export function ProcessSteps({
  steps,
  title = "How It Works",
  eyebrow = "Our Process",
  description = "A clear, predictable path from your first call to the final walkthrough.",
}: {
  steps?: unknown;
  title?: string;
  eyebrow?: string;
  description?: string;
}) {
  const parsed = asJsonArray<Step>(steps);
  const list: Step[] = parsed.length
    ? parsed
    : [
        { title: "Request Inspection", description: "Call or request online. We schedule promptly, often same-week." },
        { title: "Professional Inspection", description: "We inspect the roof surface, flashing, vents, gutters, and attic." },
        { title: "Detailed Estimate", description: "You receive a written, itemized quote with photos and material options." },
        { title: "Schedule Work", description: "Pick a date that works for you. We confirm materials and crew." },
        { title: "Professional Installation", description: "Our trained crew completes the work with jobsite protection." },
        { title: "Final Walkthrough", description: "We clean up completely and walk the job with you." },
      ];

  return (
    <section className="section" id="process">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-3">{title}</h2>
          <p className="lead mt-4">{description}</p>
        </div>

        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((step, i) => (
            <li key={i} className="relative flex gap-5">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
                <span className="absolute -inset-1.5 -z-10 rounded-full border border-primary/20" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
