import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/page-hero";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaSection } from "@/components/site/cta-section";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({
    path: "/faq/",
    title: "Frequently Asked Questions",
    description:
      "Answers to common roofing questions about repairs, replacement, cost, insurance, warranties, and how we work.",
  })),
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isEnabled: true },
    orderBy: [{ order: "asc" }, { question: "asc" }],
    select: { id: true, question: true, answer: true, category: true },
  });

  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        eyebrow="FAQ"
        description="Straight answers to the roofing questions we hear most. Can't find what you're looking for? Call us - we're happy to help."
        crumbs={[{ name: "Home", url: "/" }, { name: "FAQ" }]}
      />

      <section className="section">
        <div className="container-page max-w-3xl">
          {categories.length > 1 ? (
            <div className="mb-10 flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <a key={cat} href={`#faq-${cat.replace(/\s+/g, "-").toLowerCase()}`} className="badge px-3.5 py-1.5 hover:border-primary hover:text-primary">
                  {cat}
                </a>
              ))}
            </div>
          ) : null}

          {categories.length ? (
            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat} id={`faq-${cat.replace(/\s+/g, "-").toLowerCase()}`}>
                  <h2 className="mb-5 text-xl">{cat}</h2>
                  <FaqAccordion items={faqs.filter((f) => f.category === cat)} />
                </div>
              ))}
            </div>
          ) : (
            <FaqAccordion items={faqs} />
          )}
        </div>
      </section>

      <CtaSection title="Still Have Questions?" description="Our team is happy to walk you through your options - no obligation, no pressure." />
    </>
  );
}
