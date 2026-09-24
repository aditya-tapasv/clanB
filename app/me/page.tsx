import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { MyClanB } from "@/components/account/MyClanB";

export const metadata: Metadata = {
  title: "My Clan B",
  robots: { index: false },
};

export default function MePage() {
  return (
    <InteriorPageLayout>
      <div className="container mx-auto max-w-5xl px-4 pb-24 pt-[calc(72px+3rem)] sm:px-6 lg:px-8">
        <MyClanB />
      </div>
    </InteriorPageLayout>
  );
}
