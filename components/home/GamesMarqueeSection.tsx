import React from "react";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { Marquee } from "@/components/motion/Marquee";
import { HOME_CONTENT } from "@/content/home";

export function GamesMarqueeSection() {
  const { gamesMarquee } = HOME_CONTENT;

  return (
    <CinematicSection className="bg-ink-soft py-8" fadeTop={false} fadeBottom={false}>
      <div className="page-shell page-x mb-3 text-center md:text-left">
        <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500 font-mono">
          {gamesMarquee.label}
        </span>
      </div>
      <Marquee fadeColor="ink-soft">
        {gamesMarquee.items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-zinc-300 transition duration-300 hover:border-signal/40 hover:text-white"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </CinematicSection>
  );
}
