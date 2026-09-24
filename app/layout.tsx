import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import "./globals.css";
import { SITE_URL, jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#030706",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: "Clan B", locale: "en_IN", type: "website" },
  title: "Clan B — Technology for Playing, Hosting and Running Games & Sports",
  description:
    "The future of games. Board games and sports platform for players, venues, facilitators, and organizers.",
  icons: {
    icon: "/brand/clanb-logo.svg",
    shortcut: "/brand/clanb-logo.svg",
    apple: "/brand/clanb-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink text-white antialiased selection:bg-signal/35 selection:text-white">
        <a
          href="#main"
          className="sr-only fixed left-4 top-4 z-[60] rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:outline-2 focus:outline-white focus:outline-offset-2"
        >
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd([organizationJsonLd(), websiteJsonLd()]) }}
        />
      </body>
    </html>
  );
}
