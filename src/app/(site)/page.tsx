import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/site/hero";
import { TrustBar } from "@/components/site/trust-bar";
import { ServicesGrid } from "@/components/site/services-grid";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { ProjectsGrid } from "@/components/site/project-card";
import { ProcessSteps } from "@/components/site/process-steps";
import { StormEmergency } from "@/components/site/storm-emergency";
import { ReviewsPreview } from "@/components/site/reviews-preview";
import { ServiceAreasSection } from "@/components/site/service-areas-section";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { BlogList } from "@/components/site/blog-list";
import { CtaSection } from "@/components/site/cta-section";
import { Icon } from "@/components/ui/icon";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...(await buildMetadata({ path: "/" })),
};

export default async function HomePage() {
  const [featuredProjects, faqs, posts] = await Promise.all([
    prisma.project.findMany({
      where: { isEnabled: true, isFeatured: true },
      orderBy: [{ projectDate: "desc" }],
      take: 6,
      include: {
        service: { select: { name: true } },
        location: { select: { city: true, state: true } },
        featuredImage: { select: { url: true } },
      },
    }),
    prisma.faq.findMany({
      where: { isEnabled: true, isFeatured: true },
      orderBy: [{ order: "asc" }],
      take: 6,
      select: { id: true, question: true, answer: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
      take: 3,
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
        featuredImage: { select: { url: true } },
      },
    }),
  ]);

  return (
    <>
      {/* 1-2: Announcement bar + Header are rendered by the site layout */}
      {/* What do you do? */}
      <Hero />
      <TrustBar />
      <ServicesGrid />

      {/* Why trust you? (merged: difference + local proof) */}
      <WhyChooseUs />

      {/* Show me proof */}
      {featuredProjects.length ? (
        <section className="section" id="featured-projects">
          <div className="container-page">
            <div className="mb-12 max-w-2xl">
              <span className="eyebrow">Recent Work</span>
              <h2 className="mt-3">Featured Roofing Projects</h2>
              <p className="lead mt-4">
                Real projects from local homes and businesses, completed by our crews and documented
                from start to finish — including before &amp; after transformations.
              </p>
            </div>
            <ProjectsGrid projects={featuredProjects} />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/projects/" className="btn btn-outline">
                View All Projects
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/free-estimate/" className="btn btn-primary">
                Get a Free Estimate
                <Icon name="send" size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      <ReviewsPreview />

      {/* Where do you operate? */}
      <ServiceAreasSection />

      {/* How does it work? */}
      <ProcessSteps />

      {/* What if I have an emergency? */}
      <StormEmergency />

      {faqs.length ? (
        <section className="section bg-surface" id="faq">
          <div className="container-page max-w-3xl">
            <div className="mb-10 text-center">
              <span className="eyebrow justify-center">FAQ</span>
              <h2 className="mt-3">Frequently Asked Questions</h2>
              <p className="lead mt-4 mx-auto">
                Straight answers to the questions homeowners ask us most.
              </p>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <section className="section" id="resources">
          <div className="container-page">
            <div className="mb-12 max-w-2xl">
              <span className="eyebrow">Roofing Resources</span>
              <h2 className="mt-3">Guides &amp; Tips</h2>
              <p className="lead mt-4">
                Practical, no-nonsense information to help you make confident roofing decisions.
              </p>
            </div>
            <BlogList posts={posts} />
          </div>
        </section>
      ) : null}

      <CtaSection />
    </>
  );
}
