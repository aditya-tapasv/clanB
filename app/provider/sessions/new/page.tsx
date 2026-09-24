import { Metadata } from "next";
import { CreateSessionView } from "@/components/provider/CreateSessionView";

export const metadata: Metadata = { title: "New session" };

export default function Page() {
  return <CreateSessionView />;
}
