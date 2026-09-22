import type { Metadata } from "next";
import { getCompanySettings } from "@/lib/cms";
import { siteUrl } from "@/lib/utils";

type SeoInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  image?: string | null;
  noindex?: boolean | null;
  keywords?: string | null;
};

/**
 * Build Next.js Metadata from CMS fields. Falls back to global company
 * defaults so every page has a title + description + canonical.
 */
export async function buildMetadata(input: SeoInput = {}): Promise<Metadata> {
  const c = await getCompanySettings();
  const title = input.title?.trim() || c.name;
  const description =
    input.description?.trim() || c.description || c.tagline || "Professional roofing services.";
  const path = input.path ?? "";
  const url = siteUrl(path.replace(/^\/+/, ""));
  const image = input.image || siteUrl("og-default.jpg");

  return {
    title: title === c.name ? `${c.name} | ${c.tagline ?? "Roofing"}` : title,
    description,
    keywords: input.keywords ? input.keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: c.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** LocalBusiness structured data built entirely from factual CMS settings. */
export async function localBusinessJsonLd() {
  const c = await getCompanySettings();
  const address = [c.addressLine1, c.city, c.state, c.postalCode].filter(Boolean).join(", ");
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": siteUrl("#business"),
    name: c.name,
    description: c.description || c.tagline,
    url: siteUrl(),
    telephone: c.phone,
    email: c.email,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: c.addressLine1,
          addressLocality: c.city,
          addressRegion: c.state,
          postalCode: c.postalCode,
          addressCountry: c.country || "US",
        }
      : undefined,
    areaServed: c.serviceAreaNote || undefined,
    openingHours: c.businessHours || undefined,
    aggregateRating:
      c.googleRating > 0 && c.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: c.googleRating,
            reviewCount: c.reviewCount,
          }
      : undefined,
    sameAs: [
      c.socialFacebook,
      c.socialInstagram,
      c.socialX,
      c.socialYoutube,
      c.socialLinkedin,
      c.googleBusinessUrl,
    ].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: siteUrl(item.url.replace(/^\/+/, "")),
    })),
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export async function serviceJsonLd(service: {
  name: string;
  description?: string | null;
  slug: string;
}) {
  const c = await getCompanySettings();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description || service.name,
    url: siteUrl(service.slug),
    provider: { "@type": "RoofingContractor", name: c.name },
    areaServed: c.serviceAreaNote || undefined,
  };
}
