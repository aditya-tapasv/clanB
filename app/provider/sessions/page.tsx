import { Metadata } from "next";
import { SessionsView } from "@/components/provider/SessionsView";

export const metadata: Metadata = { title: "Sessions" };

export default function Page() {
  return <SessionsView />;
}
