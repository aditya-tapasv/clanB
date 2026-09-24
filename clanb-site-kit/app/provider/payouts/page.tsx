import { Metadata } from "next";
import { PayoutsView } from "@/components/provider/PayoutsView";

export const metadata: Metadata = { title: "Payouts" };

export default function Page() {
  return <PayoutsView />;
}
