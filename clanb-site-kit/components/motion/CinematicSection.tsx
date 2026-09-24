"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface CinematicSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  motion?: boolean;
  children: React.ReactNode;
}

export function CinematicSection({
  id,
  className,
  fadeTop = true,
  fadeBottom = true,
  motion = true,
  children,
  ...props
}: CinematicSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motion || !wrapperRef.current || !innerRef.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.fromTo(
        innerRef.current,
        { opacity: 0.35, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.8,
            immediateRender: false,
          },
        }
      );
    },
    { scope: wrapperRef }
  );

  return (
    <div
      id={id}
      data-cinematic
      ref={wrapperRef}
      className={cn("relative", className)}
      {...props}
    >
      {fadeTop && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#030706] to-transparent md:h-24"
        />
      )}
      <div
        ref={innerRef}
        className="relative z-[1] will-change-[transform,opacity,filter]"
      >
        {children}
      </div>
      {fadeBottom && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#030706] to-transparent md:h-24"
        />
      )}
    </div>
  );
}
