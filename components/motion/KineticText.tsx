"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface KineticTextProps {
  text: string;
  mode?: "scroll-highlight" | "split-up";
  className?: string;
  as?: "p" | "h2" | "h3" | "div";
}

export function KineticText({
  text,
  mode = "scroll-highlight",
  className,
  as: Tag = "p",
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      if (mode === "scroll-highlight") {
        const words = el.querySelectorAll("[data-word]");
        if (!words.length) return;

        gsap.set(words, { opacity: 0.18, filter: "blur(3px)" });

        gsap.to(words, {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.28,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "top 25%",
            scrub: 0.65,
          },
        });
      } else {
        const inner = el.querySelectorAll("[data-word-inner]");
        if (!inner.length) return;

        gsap.set(inner, { yPercent: 110, rotate: 5, transformOrigin: "50% 100%" });

        gsap.to(inner, {
          yPercent: 0,
          rotate: 0,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { scope: containerRef, dependencies: [text, mode] }
  );

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLParagraphElement>}
      aria-label={text}
      className={cn(
        "font-display text-balance leading-[1.15] tracking-tight",
        className
      )}
    >
      {mode === "scroll-highlight"
        ? words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-word
              className="mr-[0.28em] inline-block last:mr-0 will-change-[opacity,filter]"
            >
              <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                {word}
              </span>
            </span>
          ))
        : words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0"
            >
              <span
                data-word-inner
                className="inline-block bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent will-change-transform"
              >
                {word}
              </span>
            </span>
          ))}
    </Tag>
  );
}
