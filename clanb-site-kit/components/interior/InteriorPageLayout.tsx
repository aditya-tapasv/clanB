import React from "react";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CinematicPage } from "@/components/motion/CinematicPage";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export interface InteriorPageLayoutProps {
  children: React.ReactNode;
}

export function InteriorPageLayout({ children }: InteriorPageLayoutProps) {
  return (
    <SmoothScrollProvider>
      <CinematicPage>
        <SiteHeader />
        <main id="main" className="min-h-screen flex flex-col justify-between">
          <div className="flex-1">{children}</div>
        </main>
        <SiteFooter />
      </CinematicPage>
    </SmoothScrollProvider>
  );
}
