"use client";

import React, { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface StepItem {
  title: string;
  body: string;
  icon?: LucideIcon;
}

export interface StepGridProps {
  steps: StepItem[];
  className?: string;
}

/** Numbered step row in the §8.7 Trust style: border-top steps, one-shot reveal with .08 stagger. */
export function StepGrid({ steps, className }: StepGridProps) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-step]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
    },
    { scope: ref }
  );

  return (
    <ol ref={ref} className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} data-step className="space-y-3 border-t border-white/15 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
              {Icon && <Icon className="h-5 w-5 text-signal" aria-hidden="true" />}
            </div>
            <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-mist">{step.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
