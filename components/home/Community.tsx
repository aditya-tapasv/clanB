import React from "react";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { Marquee } from "@/components/motion/Marquee";
import { HOME_CONTENT } from "@/content/home";

export function Community() {
  const { community } = HOME_CONTENT;

  return (
    <CinematicSection
      id="community"
      className="bg-ink py-16 md:py-20"
      fadeTop={false}
      fadeBottom={false}
    >
      <div className="page-shell page-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
            {community.eyebrow}
          </span>
          <RevealHeadline
            text={community.headline}
            as="h2"
            split="word"
            className="mt-3 text-2xl sm:text-3xl md:text-4xl"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {community.pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-white/70"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Slow Marquee of Sample Clans / Clubs */}
      <Marquee slow fadeColor="ink">
        {community.marqueeClubs.map((club) => (
          <span
            key={club}
            className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white/25 hover:text-white/60 transition-colors"
          >
            {club}
          </span>
        ))}
      </Marquee>
    </CinematicSection>
  );
}
