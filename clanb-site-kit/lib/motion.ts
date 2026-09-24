"use client";

import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const ACCENT_PALETTE = [
  "#5CF111", // Clan B lime
  "#06B6D4", // Cyan
  "#D97706", // Amber
  "#34D399", // Emerald
  "#5EEAD4", // Teal
  "#A78BFA", // Violet
  "#F59E0B", // Yellow/Amber
  "#38BDF8", // Sky
  "#FB7185", // Rose
  "#84CC16", // Lime
] as const;

export const MOTION = {
  ease: {
    out: "power2.out",
    smooth: "power3.out",
    back: "back.out(1.55)",
    linear: "none",
  },
  duration: {
    fast: 0.35,
    normal: 0.55,
    slow: 0.85,
    reveal: 1.15,
  },
  stagger: {
    char: 0.018,
    word: 0.045,
    block: 0.08,
  },
} as const;

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

export function isTouchOrSmallScreen(): boolean {
  if (typeof window === "undefined") return true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const small = window.matchMedia("(max-width: 1023px)").matches;
  return reduce || touch || small;
}
