import type { ReactNode } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { localBusinessJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const jsonLd = await localBusinessJsonLd();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
