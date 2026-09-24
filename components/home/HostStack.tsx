"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Dices, LayoutGrid, Trophy, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HOME_CONTENT } from "@/content/home";

const CARD_ICONS = {
  host: Dices,
  venues: LayoutGrid,
  organizers: Trophy,
  "clanb-events": Sparkles,
};

export interface HostStackProps {
  /** Section copy; defaults to the homepage copy. */
  content?: typeof HOME_CONTENT.hostStack;
}

export function HostStack({ content = HOME_CONTENT.hostStack }: HostStackProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hostStack = content;

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        cards.forEach((card, i) => {
          if (i === cards.length - 1) return; // Don't recede the last card
          const nextWrapper = card.parentElement?.nextElementSibling;
          if (!nextWrapper) return;

          gsap.fromTo(
            card,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: 0.94,
              filter: "brightness(0.55)",
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top 85%",
                end: "top 25%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        cards.forEach((card) => {
          gsap.set(card, { clearProps: "transform,filter" });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section id="host" ref={containerRef} data-cinematic className="relative bg-ink py-16 md:py-24">
      {/* Header */}
      <div className="page-shell page-x pb-6 pt-12 md:pb-8 md:pt-24">
        <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
          {hostStack.eyebrow}
        </span>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <RevealHeadline
            text={hostStack.headline}
            as="h2"
            split="word"
            className="text-2xl sm:text-3xl md:text-5xl"
          />
          <Link
            href={hostStack.link.href}
            className="group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition"
          >
            <span>{hostStack.link.label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Sticky Cards Stack */}
      <div className="page-shell page-x space-y-6 md:space-y-0">
        {hostStack.cards.map((card, i) => {
          const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS] || Sparkles;

          return (
            <div
              key={card.id}
              className="relative flex items-center py-4 md:sticky md:top-[72px] md:h-[100svh] md:py-0"
              style={{ zIndex: i + 1 }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="w-full md:origin-top overflow-hidden rounded-[20px] sm:rounded-[28px] border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                style={{
                  backgroundImage: `radial-gradient(ellipse at 20% 0%, ${card.accent}22, transparent 45%)`,
                }}
              >
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[min(58vh,560px)] items-center">
                  {/* Left Column */}
                  <div className="flex flex-col h-full justify-between space-y-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Pill accent={card.accent}>
                          <Icon className="h-3.5 w-3.5" style={{ color: card.accent }} />
                          <span>{card.tag}</span>
                        </Pill>
                      </div>

                      <h3 className="mt-4 font-display text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-white">
                        {card.title}
                      </h3>

                      <p className="mt-4 text-sm md:text-base leading-relaxed text-mist">
                        {card.description}
                      </p>

                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {card.capabilities.map((cap) => (
                          <li key={cap} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                            <span
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: card.accent }}
                            />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 md:mt-auto">
                      <Button href={card.ctaHref} variant="ghost" withArrow>
                        {card.ctaLabel}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Visual Panels per card */}
                  <div className="flex items-center justify-center">
                    {/* Visual 1: Console (Terminal) */}
                    {card.visualType === "console" && (
                      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-5 font-mono text-xs shadow-2xl backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[10px] text-zinc-500">session.builder</span>
                        </div>
                        <div className="space-y-2 pt-4 text-zinc-300">
                          <p className="text-zinc-500">$ clanb publish --session &quot;Strategy Night&quot;</p>
                          <p className="text-white">→ 3 tables · capacity 18</p>
                          <p className="text-white">→ waitlist enabled</p>
                          <p style={{ color: card.accent }} className="font-semibold">
                            ✓ 14 / 18 seats booked
                          </p>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                          <div className="rounded-lg bg-white/5 p-2 text-center">
                            <div className="text-[10px] text-zinc-500">fill</div>
                            <div className="text-sm font-semibold text-white">78%</div>
                          </div>
                          <div className="rounded-lg bg-white/5 p-2 text-center">
                            <div className="text-[10px] text-zinc-500">check-ins</div>
                            <div className="text-sm font-semibold text-white">12</div>
                          </div>
                          <div className="rounded-lg bg-white/5 p-2 text-center">
                            <div className="text-[10px] text-zinc-500">rating</div>
                            <div className="text-sm font-semibold text-signal">4.8</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visual 2: Slots Grid */}
                    {card.visualType === "slots" && (
                      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                          <span className="text-white">Resource Slots & Occupancy</span>
                          <span className="text-signal">92% Booked</span>
                        </div>
                        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                            <span key={d} className="font-mono text-[9px] uppercase text-zinc-500">
                              {d}
                            </span>
                          ))}
                          {Array.from({ length: 35 }).map((_, idx) => {
                            const isPulsing = idx === 18;
                            const isFilled = idx % 3 === 0 || idx % 5 === 0;
                            const alpha = isFilled ? 0.35 + (idx % 4) * 0.15 : 0.05;

                            return (
                              <div
                                key={idx}
                                className={`h-6 rounded-md border border-white/10 transition-colors ${
                                  isPulsing ? "animate-pulse border-cyan-400 bg-cyan-400/60" : ""
                                }`}
                                style={{
                                  backgroundColor: isPulsing ? undefined : `rgba(6, 182, 212, ${alpha})`,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Visual 3: Metrics & Brackets */}
                    {card.visualType === "metrics" && (
                      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-zinc-400">Registrations</span>
                          <span className="font-display text-lg font-semibold text-white">
                            64 / 64 <span className="text-xs text-amber-500 font-mono">+ waitlist 9</span>
                          </span>
                        </div>
                        <div className="mt-6 flex items-end gap-2 h-36 border-b border-white/10 pb-2">
                          {[42, 58, 46, 72, 64, 88, 76, 94, 81, 97].map((height, barIdx) => (
                            <div
                              key={barIdx}
                              className="flex-1 rounded-t-sm transition-all"
                              style={{
                                height: `${height}%`,
                                backgroundImage: `linear-gradient(180deg, ${card.accent}, transparent)`,
                                opacity: 0.35 + barIdx * 0.06,
                              }}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between font-mono text-[10px] text-zinc-500">
                          <span>Round 1</span>
                          <span>Quarterfinals</span>
                          <span>Finals</span>
                        </div>
                      </div>
                    )}

                    {/* Visual 4: Mobile Frame */}
                    {card.visualType === "mobile" && (
                      <div
                        className="relative w-64 rounded-[2rem] border-2 border-white/15 bg-black p-4 shadow-2xl"
                        style={{ boxShadow: `0 0 60px ${card.accent}33` }}
                      >
                        <div className="mx-auto h-4 w-20 rounded-full bg-zinc-800 mb-4" />
                        <div className="space-y-3">
                          {[
                            "Official Saturday Smash",
                            "Corporate Badminton Cup",
                            "Board-Game Championship",
                            "Bengaluru Chess League",
                          ].map((ev) => (
                            <div
                              key={ev}
                              className="rounded-xl border p-2.5 text-xs transition"
                              style={{ borderColor: `${card.accent}44` }}
                            >
                              <div className="font-semibold text-white truncate">{ev}</div>
                              <div className="text-[10px] text-mist mt-0.5">Verified Clan B Host · Live</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
