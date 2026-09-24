"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HOME_CONTENT } from "@/content/home";

export function GamesMood() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);
  const livePanelRef = useRef<HTMLDivElement>(null);

  const { gamesMood } = HOME_CONTENT;
  const [activeTabId, setActiveTabId] = useState(gamesMood.tabs[0].id);

  const currentTab =
    gamesMood.tabs.find((t) => t.id === activeTabId) || gamesMood.tabs[0];

  // One-shot section reveal
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from("[data-reveal]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
        },
      });
    },
    { scope: sectionRef }
  );

  // Tab change re-animation for copy and live panel elements
  useEffect(() => {
    const copyCol = copyColRef.current;
    const livePanel = livePanelRef.current;
    if (!copyCol || !livePanel) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Left copy drift
    gsap.fromTo(
      copyCol,
      { opacity: 0.35, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );

    // Live panel blocks
    const blocks = livePanel.querySelectorAll("[data-playbook-block]");
    if (blocks.length) {
      gsap.fromTo(
        blocks,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" }
      );
    }

    // Metric bars
    const bars = livePanel.querySelectorAll<HTMLElement>("[data-metric-bar]");
    bars.forEach((bar, i) => {
      const targetScale = parseFloat(bar.getAttribute("data-target-scale") || "0");
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: targetScale,
          duration: 0.8,
          delay: 0.12 + 0.08 * i,
          ease: "power3.out",
        }
      );
    });

    // Feed rows
    const rows = livePanel.querySelectorAll("[data-feed-row]");
    if (rows.length) {
      gsap.fromTo(
        rows,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [activeTabId]);

  return (
    <section
      id="games"
      ref={sectionRef}
      data-cinematic
      className="relative overflow-hidden bg-ink page-x py-20 md:py-32"
    >
      <div className="page-shell">
        {/* Intro */}
        <div data-reveal className="space-y-3">
          <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
            {gamesMood.eyebrow}
          </span>
          <RevealHeadline
            text={gamesMood.headline}
            as="h2"
            split="word"
            className="text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-mist">
            {gamesMood.sub}
          </p>
        </div>

        {/* Tab Row */}
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-2">
          {gamesMood.tabs.map((tab) => {
            const isSelected = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-200 cursor-pointer ${
                  isSelected
                    ? "border-signal bg-signal text-ink font-semibold"
                    : "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Main Panel */}
        <div
          data-reveal
          className="mt-10 grid gap-8 overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-ink-soft p-5 sm:p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10 shadow-2xl"
        >
          {/* Left Side: Copy per active mood */}
          <div ref={copyColRef} className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Pill accent={currentTab.accent}>
                <span>{currentTab.name} Mode</span>
              </Pill>

              <blockquote className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                &ldquo;{currentTab.quote}&rdquo;
              </blockquote>

              <p className="text-sm md:text-base leading-relaxed text-mist">
                {currentTab.body}
              </p>

              <ul className="space-y-2 pt-2">
                {currentTab.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: currentTab.accent }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button href={`/games?mood=${encodeURIComponent(currentTab.name)}`} variant="signal-ghost" withArrow>
                Browse {currentTab.name} Games
              </Button>
            </div>
          </div>

          {/* Right Side: Live Playbook Telemetry Panel */}
          <div
            ref={livePanelRef}
            key={activeTabId}
            className="min-h-[320px] md:min-h-[380px] rounded-2xl border border-white/10 bg-panel p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: `radial-gradient(ellipse at 20% 0%, ${currentTab.accent}22, transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(6,182,212,.1), transparent 40%)`,
            }}
          >
            {/* Header */}
            <div data-playbook-block className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inset-0 animate-ping rounded-full opacity-70"
                    style={{ backgroundColor: currentTab.accent }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentTab.accent }}
                  />
                </span>
                <span className="font-display text-sm font-semibold text-white">
                  {currentTab.name} Table
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase text-zinc-500">
                Live Tables
              </span>
            </div>

            {/* Metrics Bars */}
            <div data-playbook-block className="my-4 space-y-3">
              {currentTab.metrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">{m.label}</span>
                    <span className="text-white font-medium">{m.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      data-metric-bar
                      data-target-scale={m.pct / 100}
                      className="h-full w-full origin-left will-change-transform"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${currentTab.accent}, #06B6D4)`,
                        transform: `scaleX(${m.pct / 100})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Feed Rows */}
            <div data-playbook-block className="space-y-2 border-t border-white/10 pt-4 font-mono text-[11px]">
              {currentTab.feedRows.map((row) => (
                <div
                  key={row}
                  data-feed-row
                  className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-zinc-300 flex items-center justify-between"
                >
                  <span className="truncate">{row}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div
          data-reveal
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h4 className="font-display text-lg font-semibold text-white">
              {gamesMood.ctaStrip.headline}
            </h4>
            <p className="text-sm text-mist">{gamesMood.ctaStrip.sub}</p>
          </div>
          <Button href={gamesMood.ctaStrip.buttonHref} variant="primary" withArrow>
            {gamesMood.ctaStrip.buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
