"use client";

import React, { useSyncExternalStore } from "react";

/** Static hero plate used when WebGL is unavailable or the canvas fails. */
export function HeroFallbackPlate() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full bg-[#030706] bg-[radial-gradient(ellipse_at_70%_40%,rgba(92,241,17,0.18),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(6,182,212,0.12),transparent_45%)]"
    />
  );
}

let webglSupport: boolean | undefined;

function detectWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <HeroFallbackPlate /> : this.props.children;
  }
}

/**
 * Never let the decorative 3D hero take the page down: no WebGL → static plate,
 * and any render/runtime error inside the canvas → static plate.
 */
export function WebGLGuard({ children }: { children: React.ReactNode }) {
  // null during SSR/hydration; the canvas is client-only anyway.
  const supported = useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
  if (supported === null) return <HeroFallbackPlate />;
  if (!supported) return <HeroFallbackPlate />;
  return <CanvasErrorBoundary>{children}</CanvasErrorBoundary>;
}
