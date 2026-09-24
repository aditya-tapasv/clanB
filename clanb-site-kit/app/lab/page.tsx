"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CinematicPage } from "@/components/motion/CinematicPage";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { RevealHeadline } from "@/components/motion/RevealHeadline";
import { KineticText } from "@/components/motion/KineticText";
import { Marquee } from "@/components/motion/Marquee";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import { Pill } from "@/components/ui/Pill";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Dialog } from "@/components/ui/Dialog";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePrefersReducedMotion } from "@/lib/motion";

export default function LabPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState("tab1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SmoothScrollProvider>
      <CinematicPage>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="min-h-screen bg-ink pt-28 pb-32 outline-none">
          {/* Header section */}
          <div className="page-shell page-x mb-16">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.28em] text-signal">
                CLAN B COMPONENT LAB
              </span>
              <Badge variant={reducedMotion ? "amber" : "signal"} ping={!reducedMotion}>
                {reducedMotion ? "Reduced Motion: ON" : "Motion Active"}
              </Badge>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl font-semibold tracking-tight">
              Motion & UI Primitives
            </h1>
            <p className="mt-4 max-w-2xl text-base text-mist">
              Interactive test bench verifying all Phase 0 and Phase 1 components,
              animations, tokens, and responsive gating.
            </p>
          </div>

          {/* Section 1: RevealHeadline and KineticText */}
          <CinematicSection className="page-shell page-x py-16">
            <div className="border-t border-white/10 pt-8">
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                01 / TYPOGRAPHY MOTION
              </span>
              <div className="mt-8 space-y-12">
                <div>
                  <p className="text-xs text-mist mb-2">RevealHeadline (split=&quot;word&quot;):</p>
                  <RevealHeadline
                    text="Technology that makes games easier to play and easier to run"
                    as="h2"
                    split="word"
                    className="text-3xl sm:text-5xl"
                  />
                </div>

                <div>
                  <p className="text-xs text-mist mb-2">RevealHeadline (split=&quot;char&quot;):</p>
                  <RevealHeadline
                    text="Play. Host. Run it better."
                    as="h2"
                    split="char"
                    className="text-3xl sm:text-5xl text-signal"
                  />
                </div>

                <div>
                  <p className="text-xs text-mist mb-2">KineticText (mode=&quot;scroll-highlight&quot;):</p>
                  <KineticText
                    mode="scroll-highlight"
                    text="We build the technology that makes games and sports easier to join and easier to run — real tables, real courts, real people, one connected platform."
                    className="text-xl sm:text-3xl text-mist"
                  />
                </div>

                <div>
                  <p className="text-xs text-mist mb-2">KineticText (mode=&quot;split-up&quot;):</p>
                  <KineticText
                    mode="split-up"
                    text="Decide. Book. Attend. Complete. Rebook."
                    className="text-2xl sm:text-4xl text-white font-semibold"
                  />
                </div>
              </div>
            </div>
          </CinematicSection>

          {/* Section 2: Marquee */}
          <CinematicSection className="py-12 bg-ink-soft">
            <div className="page-shell page-x mb-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                02 / MARQUEE (42S & 55S)
              </span>
            </div>
            <Marquee fadeColor="ink-soft">
              {[
                "Chess",
                "Catan",
                "Badminton",
                "Pickleball",
                "Codenames",
                "Futsal",
                "Ticket to Ride",
                "Azul",
                "Box Cricket",
                "Table Tennis",
              ].map((game) => (
                <Pill key={game} className="text-sm px-4 py-2 border-white/15 bg-white/5 text-white">
                  {game}
                </Pill>
              ))}
            </Marquee>

            <div className="mt-8">
              <Marquee slow fadeColor="ink-soft">
                {[
                  "Friday Strategy Club",
                  "Koramangala Smashers",
                  "Chess After Dark",
                  "Weekend Futsal League",
                  "Co-op Campaign Crew",
                  "Pickleball Ladder",
                ].map((club) => (
                  <span
                    key={club}
                    className="font-display text-2xl font-semibold tracking-tight text-white/30"
                  >
                    {club}
                  </span>
                ))}
              </Marquee>
            </div>
          </CinematicSection>

          {/* Section 3: Buttons & Interactive UI */}
          <CinematicSection className="page-shell page-x py-16">
            <div className="border-t border-white/10 pt-8">
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                03 / BUTTONS & PILLS
              </span>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button variant="primary" withArrow>
                  Primary Button
                </Button>
                <Button variant="hero-primary" withArrow>
                  Hero Primary
                </Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="hero-ghost">Hero Ghost</Button>
                <Button variant="signal-ghost">Signal Ghost</Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Pill accent="#5CF111">Board Games</Pill>
                <Pill accent="#06B6D4">Sports Courts</Pill>
                <Pill accent="#D97706">Tournaments</Pill>
                <Chip active>Active Chip</Chip>
                <Chip>Inactive Chip</Chip>
                <Badge variant="signal" ping>
                  Live Session
                </Badge>
                <Badge variant="cyan">Open Slot</Badge>
                <Badge variant="amber">2 Seats Left</Badge>
              </div>
            </div>
          </CinematicSection>

          {/* Section 4: Surfaces, Cards, Panels, Tabs */}
          <CinematicSection className="page-shell page-x py-16">
            <div className="border-t border-white/10 pt-8">
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                04 / CARDS, PANELS & TABS
              </span>

              <div className="mt-6">
                <Tabs
                  tabs={[
                    { id: "tab1", label: "Quick Play", count: 4 },
                    { id: "tab2", label: "Strategy Tables", count: 12 },
                    { id: "tab3", label: "Social Nights" },
                  ]}
                  activeId={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card accent="#5CF111">
                  <Pill accent="#5CF111">Signature Card</Pill>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                    Board-Game Strategy Table
                  </h3>
                  <p className="mt-2 text-sm text-mist">
                    Hosted tables with a facilitator who teaches the rules and
                    keeps play moving smoothly.
                  </p>
                  <div className="mt-6">
                    <Button variant="signal-ghost" withArrow>
                      Explore Table
                    </Button>
                  </div>
                </Card>

                <Panel accent="#06B6D4" className="p-6 md:p-8">
                  <Pill accent="#06B6D4">Dot Panel Texture</Pill>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                    Live Telemetry Panel
                  </h3>
                  <p className="mt-2 text-sm text-mist">
                    Displays realtime availability, player rosters, and venue
                    resource allocation.
                  </p>
                  <div className="mt-6 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Panel>
              </div>
            </div>
          </CinematicSection>

          {/* Section 5: Form inputs, Modals & EmptyState */}
          <CinematicSection className="page-shell page-x py-16">
            <div className="border-t border-white/10 pt-8">
              <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                05 / INPUTS, OVERLAYS & EMPTY STATES
              </span>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <Input placeholder="Enter your email or phone..." />
                  <Input placeholder="Search with error..." error="This field is required" />
                  <Select
                    options={[
                      { value: "bengaluru", label: "Bengaluru (Launch City)" },
                      { value: "chennai", label: "Chennai (Upcoming)" },
                    ]}
                  />
                  <div className="flex gap-4 pt-2">
                    <Button variant="ghost" onClick={() => setDialogOpen(true)}>
                      Open Test Dialog
                    </Button>
                    <Button variant="ghost" onClick={() => setSheetOpen(true)}>
                      Open Test Sheet
                    </Button>
                  </div>
                </div>

                <div>
                  <EmptyState
                    title="No Open Tables Tonight"
                    description="Tell us what you want to play and when. We'll alert you the moment a host lists a matching session."
                    actionLabel="Request a Table"
                    onAction={() => alert("Request table triggered")}
                  />
                </div>
              </div>
            </div>
          </CinematicSection>

          {/* Modals for testing */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Interactive Test Dialog"
            description="Verified accessible modal dialog with backdrop blur and ESC key trap."
          >
            <p className="text-sm text-mist">
              This modal traps keyboard focus, closes on Escape, and preserves body
              scroll integrity.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </div>
          </Dialog>

          <Sheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            title="Quick Filter Sheet"
          >
            <div className="space-y-4 py-4 text-sm text-mist">
              <p>Sheet panel drawer with slide-in transition and backdrop blur.</p>
              <div className="space-y-2">
                <label className="text-xs text-white font-medium">City</label>
                <Select
                  options={[
                    { value: "blr", label: "Bengaluru" },
                    { value: "chn", label: "Chennai" },
                  ]}
                />
              </div>
              <Button
                variant="primary"
                className="w-full justify-center mt-6"
                onClick={() => setSheetOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </Sheet>
        </main>
      </CinematicPage>
    </SmoothScrollProvider>
  );
}
