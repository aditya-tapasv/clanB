import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CinematicPage } from "@/components/motion/CinematicPage";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArenaHero } from "@/components/hero/ArenaHero";
import { IntroSection } from "@/components/home/IntroSection";
import { GamesMarqueeSection } from "@/components/home/GamesMarqueeSection";
import { MissionSection } from "@/components/home/MissionSection";
import { HostStack } from "@/components/home/HostStack";
import { Trust } from "@/components/home/Trust";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <CinematicPage>
        <SiteHeader />
        <ArenaHero>
          <IntroSection />
          <GamesMarqueeSection />
          <MissionSection />
          {/* Services: Become a Vendor · Partner · List Your Venue · Organize a Tournament */}
          <HostStack />
          <Trust />
          <SiteFooter />
        </ArenaHero>
      </CinematicPage>
    </SmoothScrollProvider>
  );
}
