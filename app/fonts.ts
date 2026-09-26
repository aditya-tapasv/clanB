import localFont from "next/font/local";

/*
 * Self-hosted latin variable fonts (same files next/font/google served), so builds never
 * depend on reaching Google Fonts — a failed download there used to fail the whole build.
 * Source: fonts.googleapis.com (Syne, DM Sans, JetBrains Mono — SIL Open Font License).
 */

export const display = localFont({
  src: "./fonts/syne-latin.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

export const body = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  weight: "100 1000",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

export const mono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
});
