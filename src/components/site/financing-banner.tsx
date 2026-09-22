import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/ui/icon";

export async function FinancingBanner() {
  const options = await prisma.financingOption.findMany({
    where: { isEnabled: true },
    orderBy: [{ order: "asc" }],
  });

  return (
    <section className="section bg-surface" id="financing">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Financing Available</span>
            <h2 className="mt-3">A New Roof Fits Your Budget</h2>
            <p className="lead mt-4">
              Roof work is a significant investment. Payment plans let you protect your home now and
              pay over time - often with options for qualified applicants.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/financing/" className="btn btn-primary">
                Explore Financing Options
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/free-estimate/" className="btn btn-outline">
                Get a Free Estimate
              </Link>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              All financing is subject to credit approval by the lender. Terms, rates, and approval
              decisions are made by the lender, not by this company. No claims of guaranteed approval
              are made or implied.
            </p>
          </div>

          {options.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((o) => (
                <div key={o.id} className="card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon name="badge" size={20} />
                  </span>
                  <h3 className="mt-4 text-base">{o.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{o.description}</p>
                  {o.providerName ? (
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                      {o.providerName}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
