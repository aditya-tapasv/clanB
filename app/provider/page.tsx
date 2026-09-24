import { Metadata } from "next";
import { TodayView } from "@/components/provider/TodayView";

export const metadata: Metadata = { title: { absolute: "Today · Provider workspace | Clan B" } };

export default function Page() {
  return <TodayView />;
}
