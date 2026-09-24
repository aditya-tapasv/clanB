"use client";

import React, { createContext, useContext, useEffect, useRef, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

let globalLenis: Lenis | null = null;
const listeners = new Set<() => void>();

function subscribeLenis(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyLenis() {
  listeners.forEach((listener) => listener());
}

function getLenisSnapshot(): Lenis | null {
  return globalLenis;
}

function getLenisServerSnapshot(): Lenis | null {
  return null;
}

export function useLenis(): Lenis | null {
  const ctx = useContext(SmoothScrollContext);
  const storeLenis = useSyncExternalStore(subscribeLenis, getLenisSnapshot, getLenisServerSnapshot);
  return ctx.lenis ?? storeLenis;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 1023px)").matches;

    const refresh = () => ScrollTrigger.refresh();

    if (reduce || touch || small) {
      requestAnimationFrame(refresh);
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      const timer = setTimeout(refresh, 400);
      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        clearTimeout(timer);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
      autoResize: true,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;
    notifyLenis();

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    const timer = setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(timer);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
      notifyLenis();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: globalLenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
