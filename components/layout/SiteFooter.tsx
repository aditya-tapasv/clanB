import React from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { HOME_CONTENT } from "@/content/home";

export function SiteFooter() {
  const { finalCta, footer } = HOME_CONTENT;

  return (
    <footer className="relative overflow-hidden bg-ink">
      {/* Background grid and subtle lime bottom wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-96 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(at bottom, rgba(92,241,17,.25), transparent 60%)",
        }}
      />

      <CinematicSection className="page-shell page-x pt-20 pb-12">
        {/* Top CTA Grid */}
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_1fr] items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
              {finalCta.eyebrow}
            </span>
            <RevealHeadline
              text={finalCta.headline}
              as="h2"
              split="char"
              className="mt-4 text-4xl sm:text-5xl md:text-6xl text-white"
            />
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-mist">
              {finalCta.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={finalCta.primaryBtn.href} variant="primary" withArrow>
                {finalCta.primaryBtn.label}
              </Button>
              <Button href={finalCta.secondaryBtn.href} variant="ghost">
                {finalCta.secondaryBtn.label}
              </Button>
            </div>
          </div>

          {/* Right Contact Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 max-w-md lg:ml-auto">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">
              Get in touch
            </span>
            <div className="space-y-3 pt-2 text-sm text-zinc-300">
              <a
                href={`mailto:${finalCta.contact.email}`}
                className="flex items-center gap-3 hover:text-white transition"
              >
                <Mail className="h-4 w-4 text-signal shrink-0" />
                <span>{finalCta.contact.email}</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-signal shrink-0" />
                <span>{finalCta.contact.locations}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Link Grid: Brand Column + 5 Category Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-3 lg:col-span-1">
            <Logo height={36} />
            <p className="text-xs leading-relaxed text-mist max-w-xs pt-2">
              {footer.brandQuote}
            </p>
          </div>

          {/* 5 Navigation Columns */}
          {footer.columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400">
                {col.title}
              </h4>
              <ul className="space-y-2 text-sm text-mist">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Bar & Chapters Navigation */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>

          {/* Chapters row per FRD requirement */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-zinc-600 font-mono">Chapters:</span>
            {footer.chapters.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                className="hover:text-signal transition-colors font-mono"
              >
                {ch.label}
              </a>
            ))}
          </div>
        </div>
      </CinematicSection>
    </footer>
  );
}
