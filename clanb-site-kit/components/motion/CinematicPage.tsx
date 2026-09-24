"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";

export function CinematicPage({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Reduced motion: the dip overlay is not created at all (§12.4).
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      const timer = setTimeout(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-cinematic]"));
        if (sections.length < 2) return;

        gsap.set(overlay, { opacity: 0 });

        sections.forEach((el, index) => {
          if (index === 0) return; // Skip hero / first section

          gsap
            .timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 98%",
                end: "top 60%",
                scrub: 1,
              },
            })
            .fromTo(overlay, { opacity: 0 }, { opacity: 0.22, duration: 0.4, ease: "none" })
            .to(overlay, { opacity: 0, duration: 0.6, ease: "none" });
        });

        ScrollTrigger.refresh();
      }, 180);

      return () => clearTimeout(timer);
    });

    return () => ctx.revert();
  }, [reduce]);

  return (
    <>
      {children}
      {!reduce && (
        <div
          ref={overlayRef}
          data-dip-overlay
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[35] bg-[#030706] opacity-0"
        />
      )}
    </>
  );
}
