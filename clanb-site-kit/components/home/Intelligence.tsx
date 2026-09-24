"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { Pill } from "@/components/ui/Pill";
import { HOME_CONTENT } from "@/content/home";

export interface IntelligenceProps {
  /** Section copy; defaults to the homepage copy. */
  content?: typeof HOME_CONTENT.intelligence;
}

export function Intelligence({ content = HOME_CONTENT.intelligence }: IntelligenceProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const edgeRefs = useRef<SVGPathElement[]>([]);
  const packetRefs = useRef<SVGCircleElement[]>([]);
  const nodeRefs = useRef<HTMLButtonElement[]>([]);
  const sonarRefs = useRef<HTMLDivElement[]>([]);
  const focusPanelRef = useRef<HTMLDivElement>(null);

  const intelligence = content;
  const [activeNodeId, setActiveNodeId] = useState<string>("engine");

  const gradientId = useId();
  const filterId = useId();

  const activeNode =
    intelligence.graphNodes.find((n) => n.id === activeNodeId) ||
    intelligence.graphNodes[0];

  const nodeMap = new Map(intelligence.graphNodes.map((n) => [n.id, n]));

  // Node Kind Colors
  const kindColors = {
    core: "#5CF111",
    edge: "#06B6D4",
    data: "#A8A29E",
  };

  // Animated Counters
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      intelligence.counters.forEach((c, i) => {
        const el = counterRefs.current[i];
        if (!el) return;

        if (reduce) {
          el.textContent = c.target.toString();
          return;
        }

        const obj = { val: 0 };
        gsap.to(obj, {
          val: c.target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: () => {
            el.textContent =
              c.target % 1 === 0 ? Math.round(obj.val).toString() : obj.val.toFixed(1);
          },
        });
      });

      // Chips reveal
      if (!reduce) {
        gsap.from("[data-outcome-chip]", {
          y: 20,
          opacity: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  // ClanGraph Timeline and Continuous Loops
  useGSAP(
    () => {
      const panel = graphContainerRef.current;
      if (!panel) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const edges = edgeRefs.current.filter(Boolean);
      const packets = packetRefs.current.filter(Boolean);
      const nodes = nodeRefs.current.filter(Boolean);
      const rings = sonarRefs.current.filter(Boolean);
      const focus = focusPanelRef.current;

      // Set initial states
      edges.forEach((e) => {
        const len = e.getTotalLength();
        e.style.strokeDasharray = `${len}`;
        e.style.strokeDashoffset = `${len}`;
      });

      gsap.set(nodes, { scale: 0.45, opacity: 0 });
      gsap.set(packets, { opacity: 0 });
      if (focus) gsap.set(focus, { y: 18, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 78%",
          once: true,
        },
      });

      tl.to(edges, {
        strokeDashoffset: 0,
        duration: 1.15,
        stagger: 0.055,
        ease: "power2.out",
      })
        .to(
          nodes,
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            stagger: 0.05,
            ease: "back.out(1.55)",
          },
          0.28
        )
        .to(focus, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.45)
        .add(() => {
          edges.forEach((e, i) => {
            e.style.strokeDasharray = "2.8 3.6";
            gsap.to(e, {
              strokeDashoffset: -80,
              duration: 3.8 + (i % 3) * 0.55,
              ease: "none",
              repeat: -1,
            });
          });
        })
        .to(packets, { opacity: 1, duration: 0.35 }, "-=0.1");

      packets.forEach((p, i) => {
        const path = edges[i];
        if (!path) return;
        const L = path.getTotalLength();
        const o = { t: 0 };

        gsap.to(o, {
          t: 1,
          duration: 2.6 + (i % 4) * 0.4,
          ease: "none",
          repeat: -1,
          delay: 1.2 + 0.24 * i,
          onUpdate: () => {
            const pt = path.getPointAtLength(o.t * L);
            p.setAttribute("cx", pt.x.toString());
            p.setAttribute("cy", pt.y.toString());
          },
        });
      });

      rings.forEach((r, i) => {
        gsap.fromTo(
          r,
          { scale: 0.75, opacity: 0.5 },
          {
            scale: 1.85 + 0.2 * i,
            opacity: 0,
            duration: 2.35 + 0.35 * i,
            repeat: -1,
            ease: "power1.out",
            delay: 0.65 * i,
          }
        );
      });
    },
    { scope: graphContainerRef }
  );

  // Re-animate focus panel on node change
  useEffect(() => {
    const focus = focusPanelRef.current;
    if (!focus) return;

    gsap.fromTo(
      focus,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" }
    );
  }, [activeNodeId]);

  return (
    <section
      id="intelligence"
      ref={sectionRef}
      data-cinematic
      className="relative overflow-hidden bg-ink-soft page-x py-24 md:py-32"
    >
      <div className="page-shell grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        {/* Left Column: Metrics & Chips */}
        <div className="space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-signal font-medium">
              {intelligence.eyebrow}
            </span>
            <RevealHeadline
              text={intelligence.headline}
              as="h2"
              split="word"
              className="mt-3 text-3xl sm:text-4xl md:text-5xl"
            />
            <p className="mt-4 text-sm md:text-base leading-relaxed text-mist">
              {intelligence.sub}
            </p>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-2 gap-6">
            {intelligence.counters.map((c, i) => (
              <div key={c.label} className="border-t border-white/15 pt-5">
                <div className="font-display text-4xl sm:text-5xl font-semibold text-white">
                  <span
                    ref={(el) => {
                      counterRefs.current[i] = el;
                    }}
                  >
                    0
                  </span>
                  {c.suffix && <span className="text-signal">{c.suffix}</span>}
                </div>
                <div className="mt-1 text-xs text-mist">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {intelligence.chips.map((chip) => (
              <span
                key={chip}
                data-outcome-chip
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/70"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: ClanGraph Interactive Topology */}
        <div
          ref={graphContainerRef}
          onPointerLeave={() => setActiveNodeId("engine")}
          className="relative h-[320px] min-h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-[28px] border border-white/10 bg-panel p-4 shadow-2xl overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 40%, rgba(92,241,17,.13), transparent 52%), radial-gradient(ellipse at 85% 15%, rgba(6,182,212,.08), transparent 42%)",
          }}
        >
          {/* Dot texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.45) .55px, transparent .55px)",
              backgroundSize: "17px 17px",
            }}
          />

          {/* Ping label */}
          <div className="absolute left-6 top-6 z-20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              Live Graph
            </span>
          </div>

          {/* Glow blob tracking active node */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl transition-all duration-500"
            style={{
              left: `${activeNode.x}%`,
              top: `${activeNode.y}%`,
              backgroundColor: kindColors[activeNode.kind],
            }}
          />

          {/* SVG Canvas for Edges */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full pointer-events-none z-10"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5CF111" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.75" />
              </linearGradient>
              <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.1" />
              </filter>
            </defs>

            {/* Base and Animated Edges */}
            {intelligence.graphEdges.map(([fromId, toId], i) => {
              const nodeA = nodeMap.get(fromId);
              const nodeB = nodeMap.get(toId);
              if (!nodeA || !nodeB) return null;

              const mx = (nodeA.x + nodeB.x) / 2;
              const my = (nodeA.y + nodeB.y) / 2;
              const dx = nodeB.x - nodeA.x;
              const dy = nodeB.y - nodeA.y;
              const qx = mx - 0.08 * dy;
              const qy = my + 0.08 * dx;
              const d = `M ${nodeA.x} ${nodeA.y} Q ${qx} ${qy} ${nodeB.x} ${nodeB.y}`;

              const isConnected =
                activeNodeId === fromId || activeNodeId === toId;

              return (
                <g key={`${fromId}-${toId}`}>
                  {/* Base subtle edge */}
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.07)"
                    strokeWidth="0.35"
                  />
                  {/* Animated edge */}
                  <path
                    ref={(el) => {
                      if (el) edgeRefs.current[i] = el;
                    }}
                    d={d}
                    fill="none"
                    stroke={isConnected ? `url(#${gradientId})` : "rgba(255, 255, 255, 0.16)"}
                    strokeWidth={isConnected ? "0.65" : "0.32"}
                    opacity={isConnected ? 1 : 0.55}
                    className="transition-[stroke,stroke-width] duration-300"
                  />
                  {/* Floating packet circle */}
                  <circle
                    ref={(el) => {
                      if (el) packetRefs.current[i] = el;
                    }}
                    r={isConnected ? "0.85" : "0.55"}
                    fill={isConnected ? "#5CF111" : "#06B6D4"}
                    filter={isConnected ? `url(#${filterId})` : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {intelligence.graphNodes.map((node) => {
            const isActive = node.id === activeNodeId;
            const isCore = node.kind === "core";
            const color = kindColors[node.kind];

            return (
              <button
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.push(el);
                }}
                onPointerEnter={() => setActiveNodeId(node.id)}
                onFocus={() => setActiveNodeId(node.id)}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer focus:outline-none transition-transform duration-300 ${
                  isActive ? "scale-125" : "opacity-80 hover:scale-110"
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                aria-label={`${node.label} (${node.kind} node)`}
              >
                {/* Sonar rings for core node */}
                {isCore && (
                  <>
                    <div
                      ref={(el) => {
                        if (el) sonarRefs.current[0] = el;
                      }}
                      className="absolute inset-0 -m-3 h-11 w-11 rounded-full border border-signal/35 pointer-events-none"
                    />
                    <div
                      ref={(el) => {
                        if (el) sonarRefs.current[1] = el;
                      }}
                      className="absolute inset-0 -m-3 h-11 w-11 rounded-full border border-cyan-400/25 pointer-events-none"
                    />
                  </>
                )}

                {/* Node Dot */}
                <div
                  className={`rounded-full border transition-shadow ${
                    isCore ? "h-4 w-4 sm:h-5 sm:w-5" : "h-2.5 w-2.5 sm:h-3 sm:w-3"
                  } ${isActive ? "border-white/50" : "border-transparent"}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: isActive
                      ? `0 0 0 4px ${color}22, 0 0 28px ${color}88`
                      : `0 0 12px ${color}33`,
                  }}
                />

                {/* Node Label (hidden on very small viewports) */}
                <span
                  className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.16em] hidden sm:block transition-colors ${
                    isActive ? "text-white font-semibold" : "text-white/30 hover:text-white/65"
                  }`}
                >
                  {node.label}
                </span>
              </button>
            );
          })}

          {/* Focus Panel Card (Bottom overlay) */}
          <div
            ref={focusPanelRef}
            className="absolute inset-x-4 bottom-4 z-30 rounded-xl border border-white/10 bg-black/80 p-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                  Active Node
                </span>
                <h4 className="font-display text-lg sm:text-xl font-semibold text-white">
                  {activeNode.label}
                </h4>
              </div>
              <Pill accent={kindColors[activeNode.kind]}>
                <span className="capitalize">{activeNode.kind}</span>
              </Pill>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-mist">{activeNode.blurb}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
