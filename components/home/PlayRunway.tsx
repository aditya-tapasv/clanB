"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HOME_CONTENT } from "@/content/home";

export function PlayRunway() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { playRunway } = HOME_CONTENT;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const bar = progressBarRef.current;
      if (!section || !track || !bar) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
          gsap.set(bar, { scaleX: 1 });
          return;
        }

        gsap.set(track, { xPercent: 0, x: 0 });
        gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.max(2400, 0.75 * track.scrollWidth),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            x: () => {
              const overflow = track.scrollWidth - window.innerWidth;
              return overflow > 0 ? -overflow - 40 : 0;
            },
            ease: "none",
            duration: 1,
          },
          0
        ).to(
          bar,
          {
            scaleX: 1,
            ease: "none",
            duration: 1,
          },
          0
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(track, { clearProps: "transform,x,xPercent" });
        gsap.set(bar, { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="play"
      ref={sectionRef}
      data-cinematic
      className="relative overflow-hidden bg-ink-soft py-16 md:box-border md:flex md:h-svh md:flex-col md:py-0"
      style={{
        backgroundImage: "radial-gradient(at top, rgba(92,241,17,.08), transparent 45%)",
      }}
    >
      {/* Top Seam Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#030706] to-transparent md:h-24"
      />

      {/* Header Row */}
      <div className="relative z-10 flex page-shell shrink-0 flex-col gap-4 page-x pb-8 pt-2 md:flex-row md:items-end md:justify-between md:pb-5 md:pt-[5.75rem]">
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
            {playRunway.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {playRunway.h2}
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="hidden max-w-sm text-sm text-mist md:block">
            {playRunway.note}
          </p>
          <Link
            href={playRunway.link.href}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white transition hover:text-signal"
          >
            <span>{playRunway.link.label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Runway Track */}
      <div className="relative z-10 flex-1 overflow-visible md:overflow-hidden md:flex md:items-center">
        <div
          ref={trackRef}
          className="flex w-full flex-col gap-6 page-x will-change-transform md:w-max md:flex-row md:gap-8"
        >
          {playRunway.cards.map((card) => (
            <div
              key={card.id}
              className="relative min-w-0 overflow-hidden rounded-[20px] border border-white/10 bg-zinc-950/90 p-5 sm:rounded-[28px] sm:p-6 md:min-w-[min(80vw,1100px)] md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            >
              {/* Card Tone Overlay */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone} opacity-40`}
              />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                {/* Left Side */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Pill accent="#5CF111">{card.category}</Pill>
                    <span className="font-mono text-xs text-white/60">
                      {card.index}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                    {card.title}
                  </h3>

                  <p className="text-sm md:text-base leading-relaxed text-mist">
                    {card.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-2xl border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs text-zinc-300"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Button href={card.ctaHref} variant="signal-ghost" withArrow>
                      {card.ctaLabel}
                    </Button>
                  </div>
                </div>

                {/* Right Side: Wireframe Interactive Mock Card */}
                <div className="relative min-h-[240px] md:min-h-[320px] rounded-2xl border border-white/10 bg-black/50 p-6 overflow-hidden flex flex-col justify-between">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 grid-bg opacity-30"
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-signal animate-ping" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                        Live Booking Slot
                      </span>
                    </div>
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      Verified Table
                    </span>
                  </div>

                  {/* Visual card content */}
                  <div className="relative z-10 space-y-3 my-4">
                    <div className="h-4 w-3/4 rounded bg-white/15" />
                    <div className="h-3 w-1/2 rounded bg-white/10" />
                  </div>

                  {/* 3-Tile Row */}
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                      <div className="font-mono text-[10px] text-zinc-400">Seats</div>
                      <div className="font-display text-sm font-semibold text-white">4 Available</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                      <div className="font-mono text-[10px] text-zinc-400">Level</div>
                      <div className="font-display text-sm font-semibold text-signal">All Welcome</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                      <div className="font-mono text-[10px] text-zinc-400">Policy</div>
                      <div className="font-display text-sm font-semibold text-zinc-300">Free Cancel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar (Bottom of pinned runway) */}
      <div className="relative z-20 page-shell page-x pb-6 pt-4 hidden md:block">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-signal via-glow to-white will-change-transform"
          />
        </div>
      </div>

      {/* Bottom Seam Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#030706] to-transparent md:h-24"
      />
    </section>
  );
}
