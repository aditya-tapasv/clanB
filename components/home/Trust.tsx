"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  QrCode,
  LifeBuoy,
  ArrowUpRight,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { HOME_CONTENT } from "@/content/home";

const TRUST_ICONS = {
  ShieldCheck,
  FileCheck,
  QrCode,
  LifeBuoy,
};

export interface TrustProps {
  /** Section copy; defaults to the homepage copy. */
  content?: typeof HOME_CONTENT.trust;
}

export function Trust({ content = HOME_CONTENT.trust }: TrustProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trust = content;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from("[data-trust-step]", {
        y: 32,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
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
      id="trust"
      ref={sectionRef}
      data-cinematic
      className="relative overflow-hidden bg-ink page-x py-20 md:py-28"
    >
      <div className="page-shell">
        {/* Intro */}
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
            {trust.eyebrow}
          </span>
          <RevealHeadline
            text={trust.headline}
            as="h2"
            split="word"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-mist">
            {trust.sub}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.steps.map((step) => {
            const Icon = TRUST_ICONS[step.icon as keyof typeof TRUST_ICONS] || ShieldCheck;

            return (
              <div
                key={step.index}
                data-trust-step
                className="border-t border-white/15 pt-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">{step.index}</span>
                  <Icon className="h-5 w-5 text-signal" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-mist">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-12 pt-4">
          <Link
            href={trust.link.href}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white transition hover:text-signal"
          >
            <span>{trust.link.label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
