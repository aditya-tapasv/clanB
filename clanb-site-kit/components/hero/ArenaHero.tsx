"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { useLiquidLens } from "./useLiquidLens";
import { HOME_CONTENT } from "@/content/home";
import type { ArenaCanvasApi } from "./ArenaCanvas";
import { HeroFallbackPlate, WebGLGuard } from "./WebGLGuard";

// Dynamically import ArenaCanvas to prevent SSR of WebGL
const ArenaCanvas = dynamic(
  () => import("./ArenaCanvas").then((mod) => mod.ArenaCanvas),
  {
    ssr: false,
    loading: () => <HeroFallbackPlate />,
  }
);

interface ArenaHeroProps {
  children?: React.ReactNode;
}

export function ArenaHero({ children }: ArenaHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  // The cover is a sibling of the hero section, so target it by ref (not a section-scoped selector).
  const coverRef = useRef<HTMLDivElement>(null);
  const canvasApi = useRef<ArenaCanvasApi | null>(null);

  // Liquid lens cursor mask on the veil
  useLiquidLens(sectionRef, veilRef);

  // Desktop scroll timeline
  useGSAP(
    () => {
      const copy = copyRef.current;
      const canvasWrap = canvasWrapRef.current;
      const cover = coverRef.current;
      if (!copy || !canvasWrap || !cover) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const proxy = { p: 0 };

        gsap
          .timeline({
            scrollTrigger: {
              trigger: cover,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          })
          .to(copy, { y: -48, opacity: 0.35, ease: "none", duration: 1 }, 0)
          .to(canvasWrap, { scale: 1.06, ease: "none", duration: 1 }, 0)
          .to(
            proxy,
            {
              p: 1,
              duration: 1,
              ease: "none",
              onUpdate: () => {
                canvasApi.current?.setZoom(0.65 * proxy.p);
                canvasApi.current?.setPulse(0.3 + 0.45 * proxy.p);
              },
            },
            0
          );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const { hero } = HOME_CONTENT;

  return (
    <main id="main" tabIndex={-1} className="relative bg-ink outline-none">
      {/* Sticky Hero Section */}
      <section
        ref={sectionRef}
        data-cinematic
        className="sticky top-0 z-0 h-[100svh] min-h-[560px] overflow-hidden bg-[#030706]"
      >
        {/* Canvas Wrap */}
        <div
          ref={canvasWrapRef}
          className="absolute inset-0 z-0 origin-center will-change-transform"
        >
          <div className="absolute inset-0 overflow-hidden bg-[#030706]">
            <WebGLGuard>
              <ArenaCanvas
                className="h-full w-full"
                onReady={(api) => {
                  canvasApi.current = api;
                }}
              />
            </WebGLGuard>
            {/* Top & Bottom gradient fades */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030706]/60 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030706]/75 to-transparent"
            />
          </div>
        </div>

        {/* Hero Veil Blend with Liquid Lens mask applied */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] hero-veil-blend"
        />

        {/* Hero Foreground Copy (Static on load per Mash spec) */}
        <div className="relative z-10 page-shell page-x flex h-full items-end pb-10 pt-24 sm:items-center sm:py-28">
          <div
            ref={copyRef}
            className="relative w-full max-w-xl will-change-transform lg:max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="text-[10px] tracking-[0.24em] uppercase text-signal sm:text-xs sm:tracking-[0.32em]">
              {hero.eyebrow}
            </div>

            {/* H1 */}
            <h1 className="mt-4 font-display font-semibold text-[1.85rem] leading-[1.08] tracking-tight max-w-[16ch] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] min-[400px]:text-4xl sm:text-5xl sm:max-w-[14ch] md:text-6xl lg:text-[3.75rem]">
              {hero.h1}
            </h1>

            {/* Sub */}
            <p className="mt-6 text-sm leading-relaxed text-mist sm:text-base md:text-lg max-w-xl">
              {hero.sub}
            </p>

            {/* Action Row */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href={hero.primaryCta.href}
                variant="hero-primary"
                withArrow
                className="w-full sm:w-auto"
              >
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="hero-ghost"
                className="w-full sm:w-auto"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>

            {/* Tagline */}
            <div className="mt-10 flex items-center gap-3">
              <div className="h-px w-8 bg-amber-600/80" />
              <span className="text-[11px] tracking-[0.22em] text-amber-600 font-medium">
                {hero.tagline}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Curtain Sheet */}
      <div ref={coverRef} data-hero-cover data-cinematic className="relative z-20 -mt-1">
        <div className="relative rounded-t-[1.75rem] border-t border-white/10 bg-[#030706] shadow-[0_-40px_100px_rgba(0,0,0,0.75)] md:rounded-t-[2.5rem]">
          {children}
        </div>
      </div>
    </main>
  );
}
