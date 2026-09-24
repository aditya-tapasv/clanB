import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CinematicPage } from "@/components/motion/CinematicPage";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArenaHero } from "@/components/hero/ArenaHero";
import { IntroSection } from "@/components/home/IntroSection";
import { GamesMarqueeSection } from "@/components/home/GamesMarqueeSection";
import { MissionSection } from "@/components/home/MissionSection";
import { PlayRunway } from "@/components/home/PlayRunway";
import { HostStack } from "@/components/home/HostStack";
import { SportsPulse } from "@/components/home/SportsPulse";
import { GamesMood } from "@/components/home/GamesMood";
import { Intelligence } from "@/components/home/Intelligence";
import { Community } from "@/components/home/Community";
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
          <PlayRunway />
          <HostStack />
          <SportsPulse />
          <GamesMood />
          <Intelligence />
          <Community />
          <Trust />
          <SiteFooter />
        </ArenaHero>
      </CinematicPage>
    </SmoothScrollProvider>
  );
}
