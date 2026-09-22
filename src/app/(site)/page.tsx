import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/site/hero";
import { TrustBar } from "@/components/site/trust-bar";
import { ServicesGrid } from "@/components/site/services-grid";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { ProjectsGrid } from "@/components/site/project-card";
import { BeforeAfterSection } from "@/components/site/before-after-section";
import { ProcessSteps } from "@/components/site/process-steps";
import { MaterialsGrid } from "@/components/site/materials-grid";
import { StormEmergency } from "@/components/site/storm-emergency";
import { FinancingBanner } from "@/components/site/financing-banner";
import { ReviewsPreview } from "@/components/site/reviews-preview";
import { ServiceAreasSection } from "@/components/site/service-areas-section";
import { AboutPreview } from "@/components/site/about-preview";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { BlogList } from "@/components/site/blog-list";
import { CtaSection } from "@/components/site/cta-section";
import { Certifications } from "@/components/site/certifications";
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
      take: 8,
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
      <Hero />
      <TrustBar />
      <Certifications />
      <ServicesGrid />
      <WhyChooseUs />
      {featuredProjects.length ? (
        <section className="section" id="featured-projects">
          <div className="container-page">
            <div className="mb-12 max-w-2xl">
              <span className="eyebrow">Recent Work</span>
              <h2 className="mt-3">Featured Roofing Projects</h2>
              <p className="lead mt-4">
                Real projects from local homes and businesses, completed by our crews and documented
                from start to finish.
              </p>
            </div>
            <ProjectsGrid projects={featuredProjects} />
          </div>
        </section>
      ) : null}
      <BeforeAfterSection />
      <ProcessSteps />
      <MaterialsGrid />
      <StormEmergency />
      <FinancingBanner />
      <ReviewsPreview />
      <ServiceAreasSection />
      <AboutPreview />

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
