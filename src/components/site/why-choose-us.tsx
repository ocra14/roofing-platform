import { Icon, type IconName } from "@/components/ui/icon";

const ITEMS: { icon: IconName; title: string; description: string }[] = [
  { icon: "map-pin", title: "Local Roofing Experts", description: "We live and work in this community and know exactly how local weather affects roofs here." },
  { icon: "shield", title: "Licensed & Insured", description: "Current licensing and insurance, with certificates provided before any work begins." },
  { icon: "file", title: "Transparent Estimates", description: "Written, itemized quotes with photos. No hidden fees and no pressure to decide on the spot." },
  { icon: "badge", title: "Manufacturer Certified", description: "Properly trained on the products we install so full manufacturer warranties apply." },
  { icon: "check", title: "Workmanship Warranty", description: "We stand behind our installation with a written workmanship guarantee." },
  { icon: "home", title: "Professional Cleanup", description: "Debris hauled away and a magnetic nail sweep of your property before walkthrough." },
  { icon: "bolt", title: "Fast Response", description: "Prompt callbacks and same-week inspections, with emergency tarping when needed." },
  { icon: "layer", title: "Quality Materials", description: "We install products we would put on our own homes, from trusted manufacturers." },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-surface" id="why-choose-us">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="mt-3">The Difference Is in the Details</h2>
          <p className="lead mt-4">
            Homeowners trust us with one of their largest investments. Here is how we earn that trust
            on every project.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-line/60 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/10 hover:shadow-[0_8px_24px_-12px_rgba(15,39,69,0.12)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.06] ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                <Icon name={item.icon} size={18} className="text-primary group-hover:text-white" />
              </span>
              <h3 className="mt-4 text-[14px] font-bold tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
