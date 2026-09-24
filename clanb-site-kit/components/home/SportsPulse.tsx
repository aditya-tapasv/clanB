"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { HOME_CONTENT } from "@/content/home";

export function SportsPulse() {
  const sectionRef = useRef<HTMLElement>(null);
  const { sportsPulse } = HOME_CONTENT;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from("[data-sports-reveal]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
        },
      });

      gsap.from("[data-sports-row]", {
        x: -10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="sports"
      ref={sectionRef}
      data-cinematic
      className="relative overflow-hidden bg-ink-soft page-x py-20 md:py-32"
    >
      <div className="page-shell">
        {/* Intro */}
        <div data-sports-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
              {sportsPulse.eyebrow}
            </span>
            <RevealHeadline
              text={sportsPulse.headline}
              as="h2"
              split="word"
              className="mt-3 text-3xl sm:text-4xl md:text-5xl"
            />
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-mist">
              {sportsPulse.sub}
            </p>
          </div>
          <Link
            href={sportsPulse.link.href}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white transition hover:text-signal"
          >
            <span>{sportsPulse.link.label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3 Panels Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {sportsPulse.panels.map((panel, panelIdx) => (
            <div
              key={panel.title}
              data-sports-reveal
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl relative overflow-hidden"
              style={{
                backgroundImage:
                  panelIdx === 0
                    ? "radial-gradient(ellipse at 20% 0%, rgba(92,241,17,.15), transparent 50%)"
                    : panelIdx === 1
                    ? "radial-gradient(ellipse at 20% 0%, rgba(6,182,212,.15), transparent 50%)"
                    : "radial-gradient(ellipse at 20% 0%, rgba(217,119,6,.15), transparent 50%)",
              }}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    {panel.isLive && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                      </span>
                    )}
                    <h3 className="font-display text-lg font-semibold text-white">
                      {panel.title}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-zinc-500">
                    Feed 0{panelIdx + 1}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-5 space-y-4">
                  {panel.items.map((item, itemIdx) => (
                    <div
                      key={item.title}
                      data-sports-row
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1.5 transition hover:border-white/15"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="font-mono text-[11px] text-signal shrink-0">
                          {item.detail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                        <span>{item.comp}</span>
                        {itemIdx === panel.items.length - 1 && (
                          <Link
                            href={item.venueLink}
                            className="text-signal hover:underline inline-flex items-center gap-1"
                          >
                            <span>Where to play nearby →</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source & Freshness Footer */}
              <div className="mt-8 border-t border-white/10 pt-3 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                <span>Updated {panel.updatedAt}</span>
                <span>Source: {panel.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
