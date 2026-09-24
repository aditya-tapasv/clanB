"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface RevealHeadlineProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  split?: "word" | "char";
}

export function RevealHeadline({
  text,
  as: Tag = "h2",
  className,
  split = "word",
}: RevealHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const units = el.querySelectorAll("[data-reveal-unit]");
      if (!units.length) return;

      gsap.set(units, { opacity: 0.18, filter: "blur(3px)", y: 12 });

      gsap.to(units, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        ease: "power2.out",
        stagger: split === "char" ? 0.018 : 0.045,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.65,
        },
      });
    },
    { scope: containerRef, dependencies: [text, split] }
  );

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      aria-label={text}
      className={cn(
        "font-display font-semibold tracking-tight text-balance",
        className
      )}
    >
      {words.map((word, wordIdx) => (
        <span
          key={`${word}-${wordIdx}`}
          className="mr-[0.28em] inline-block max-w-full last:mr-0 [overflow-wrap:anywhere]"
        >
          {split === "char" ? (
            Array.from(word).map((char, charIdx) => (
              <span
                key={`${char}-${charIdx}`}
                data-reveal-unit
                className="inline-block bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent will-change-[opacity,transform,filter]"
              >
                {char}
              </span>
            ))
          ) : (
            <span
              data-reveal-unit
              className="inline-block bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent will-change-[opacity,transform,filter]"
            >
              {word}
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}
