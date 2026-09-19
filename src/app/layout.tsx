import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { EnvelopeIntro } from "@/components/shell/EnvelopeIntro";
import { FloatingRsvp } from "@/components/shell/FloatingRsvp";
import { Grain } from "@/components/shell/Grain";
import { IntroProvider } from "@/components/shell/intro-context";
import { MusicToggle } from "@/components/shell/MusicToggle";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { invitation } from "@/content/invitation";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
});

/**
 * Absolute URLs are required for share previews. Vercel supplies its own domain
 * automatically; set NEXT_PUBLIC_SITE_URL once a custom domain is attached.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: invitation.meta.title,
  description: invitation.meta.description,
  // A private family invitation has no business in search results.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: invitation.meta.title, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Blends the browser chrome into the design instead of framing it in grey.
  themeColor: "#0e2a23",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <SmoothScroll>
          <IntroProvider>
            <EnvelopeIntro />
            {children}
            <MusicToggle />
            <FloatingRsvp />
          </IntroProvider>
        </SmoothScroll>
        <Grain />
      </body>
    </html>
  );
}
