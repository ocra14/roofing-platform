import Link from "next/link";
import { getCompanySettings } from "@/lib/cms";
import { Icon } from "@/components/ui/icon";
import { formatPhone, telHref } from "@/lib/utils";

export default async function NotFound() {
  const company = await getCompanySettings();

  const links = [
    { label: "Roofing Services", url: "/roofing-services/" },
    { label: "Projects", url: "/projects/" },
    { label: "Service Areas", url: "/service-areas/" },
    { label: "Free Estimate", url: "/free-estimate/" },
    { label: "Contact", url: "/contact/" },
    { label: "Blog", url: "/blog/" },
  ];

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-primary text-white">
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{ backgroundImage: "repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 90px)" }}
      />
      <div className="container-page relative w-full py-20 text-center">
        <p className="font-display text-7xl font-bold text-accent sm:text-8xl">404</p>
        <h1 className="mt-6 text-white">Page Not Found</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/70">
          The page you're looking for may have been moved or no longer exists. Try one of these
          links, or call us - we're happy to help.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-accent btn-lg">
            <Icon name="home" size={17} />
            Back to Home
          </Link>
          {company.phone ? (
            <a href={telHref(company.phone)} className="btn btn-ghost-light btn-lg">
              <Icon name="phone" size={17} />
              Call {formatPhone(company.phone)}
            </a>
          ) : null}
        </div>

        <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          {links.map((l) => (
            <li key={l.url}>
              <Link href={l.url} className="font-medium text-white/75 underline-offset-4 hover:text-white hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
