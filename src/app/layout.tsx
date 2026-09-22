import type { ReactNode } from "react";
import "./globals.css";
import { BrandingVars, CompanyHeadMeta } from "@/components/site/branding-vars";
import { TrackingScripts } from "@/components/site/tracking";

export const metadata = {
  title: {
    default: "Roofing Company",
    template: "%s | Roofing Company",
  },
  description: "Professional roofing services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <BrandingVars />
        <CompanyHeadMeta />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-canvas font-body text-ink antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <TrackingScripts />
      </body>
    </html>
  );
}
