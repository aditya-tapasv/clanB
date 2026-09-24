import { Metadata } from "next";
import { ProviderProvider } from "@/components/provider/ProviderContext";
import { ProviderShell } from "@/components/provider/ProviderShell";

export const metadata: Metadata = {
  title: { template: "%s · Provider workspace | Clan B", default: "Provider workspace | Clan B" },
  robots: { index: false },
};

/** Dense operational UI: no Lenis, no cinematic motion (FRD 1.3 / 19.1). */
export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProviderProvider>
      <ProviderShell>{children}</ProviderShell>
    </ProviderProvider>
  );
}
