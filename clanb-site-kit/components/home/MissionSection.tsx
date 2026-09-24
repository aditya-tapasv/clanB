import React from "react";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { KineticText } from "@/components/motion/KineticText";
import { HOME_CONTENT } from "@/content/home";

export function MissionSection() {
  const { mission } = HOME_CONTENT;

  return (
    <CinematicSection className="bg-ink py-20 sm:py-24 md:py-32">
      <div className="page-shell page-x">
        <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
          {mission.label}
        </span>
        <div className="mt-6 max-w-5xl">
          <KineticText
            mode="scroll-highlight"
            text={mission.text}
            className="font-display font-semibold text-balance tracking-tight leading-[1.15] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-mist"
          />
        </div>
      </div>
    </CinematicSection>
  );
}
