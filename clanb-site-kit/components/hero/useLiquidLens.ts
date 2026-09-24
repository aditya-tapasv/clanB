"use client";

import { useEffect, RefObject } from "react";

export function useLiquidLens(
  sectionRef: RefObject<HTMLElement | null>,
  veilRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Gated to md+ fine pointer only
    const isDesktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

    const section = sectionRef.current;
    const veil = veilRef.current;
    if (!section || !veil) return;

    const target = { x: 28, y: 45, active: 0 };
    const cur = { x: 28, y: 45, size: 0 };
    const trail = { x: 28, y: 45 };

    let raf = 0;
    let px = 28;
    let py = 45;

    function paint() {
      if (!veil) return;
      if (cur.size <= 1) {
        veil.style.maskImage = veil.style.webkitMaskImage = "none";
        return;
      }

      const t = performance.now() / 1000;
      const s = cur.size * (1 + 0.08 * Math.sin(2.4 * t));
      const v = Math.min(2.2 * Math.hypot(cur.x - px, cur.y - py), 1);
      const st = 1 + 0.55 * v;
      const sq = 1 - 0.22 * v;

      const o1x = 8 * Math.cos(1.5 * t);
      const o1y = 6 * Math.sin(1.8 * t);
      const o2x = -10 * Math.cos(1.1 * t + 1.2);
      const o2y = 8 * Math.sin(1.35 * t + 0.6);
      const o3x = 7 * Math.sin(1.7 * t + 2.1);
      const o3y = -5 * Math.cos(1.25 * t + 1.4);

      const stops =
        "transparent 0%, transparent 20%, rgba(0,0,0,0.3) 48%, rgba(0,0,0,0.65) 74%, #000 100%";
      const stopsTrail =
        "transparent 0%, transparent 10%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.78) 70%, #000 100%";

      const m = [
        `radial-gradient(ellipse ${1.05 * s * st}px ${0.72 * s * sq}px at calc(${cur.x}% + ${o1x}px) calc(${cur.y}% + ${o1y}px), ${stops})`,
        `radial-gradient(ellipse ${0.78 * s * sq}px ${0.98 * s * st}px at calc(${cur.x}% + ${o2x}px) calc(${cur.y}% + ${o2y}px), ${stops})`,
        `radial-gradient(ellipse ${0.92 * s}px ${0.7 * s}px at calc(${trail.x}% + ${o3x}px) calc(${trail.y}% + ${o3y}px), ${stopsTrail})`,
      ].join(", ");

      veil.style.webkitMaskImage = veil.style.maskImage = m;
      const maskStyle = veil.style as CSSStyleDeclaration & {
        webkitMaskComposite?: string;
        maskComposite?: string;
      };
      maskStyle.webkitMaskComposite = "destination-out, destination-out, destination-out";
      maskStyle.maskComposite = "intersect";
    }

    function loop() {
      if (raf) return;

      const step = () => {
        px = cur.x;
        py = cur.y;
        cur.x += (target.x - cur.x) * 0.085;
        cur.y += (target.y - cur.y) * 0.085;
        trail.x += (cur.x - trail.x) * 0.055;
        trail.y += (cur.y - trail.y) * 0.055;

        const goal = target.active ? 168 : 0;
        cur.size += (goal - cur.size) * 0.12;
        paint();

        const moving =
          Math.abs(target.x - cur.x) > 0.02 ||
          Math.abs(target.y - cur.y) > 0.02 ||
          Math.abs(cur.x - trail.x) > 0.04 ||
          Math.abs(goal - cur.size) > 0.4 ||
          cur.size > 1;

        if (moving) {
          raf = requestAnimationFrame(step);
        } else {
          raf = 0;
          if (cur.size <= 1) paint();
        }
      };

      raf = requestAnimationFrame(step);
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      target.x = x;
      target.y = y;
      target.active = x < 62 ? 1 : 0;
      loop();
    };

    const onPointerLeave = () => {
      target.active = 0;
      loop();
    };

    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      if (veil) {
        veil.style.maskImage = veil.style.webkitMaskImage = "none";
      }
    };
  }, [sectionRef, veilRef]);
}
