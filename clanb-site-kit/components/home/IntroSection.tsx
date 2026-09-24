import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { HOME_CONTENT } from "@/content/home";

export function IntroSection() {
  const { intro } = HOME_CONTENT;

  return (
    <CinematicSection className="bg-ink py-16 sm:py-20 md:py-28">
      <div className="page-shell page-x grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
            {intro.eyebrow}
          </span>
          <RevealHeadline
            text={intro.headline}
            as="h2"
            split="word"
            className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-balance"
          />
        </div>

        <div className="space-y-6">
          <p className="text-sm md:text-base leading-relaxed text-mist">
            {intro.blurb}
          </p>
          <div>
            <Link
              href={intro.link.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-white transition hover:text-signal"
            >
              <span>{intro.link.label}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </CinematicSection>
  );
}
