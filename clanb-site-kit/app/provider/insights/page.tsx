import { Metadata } from "next";
import { InsightsView } from "@/components/provider/InsightsView";

export const metadata: Metadata = { title: "Insights" };

export default function Page() {
  return <InsightsView />;
}
