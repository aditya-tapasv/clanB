import { Metadata } from "next";
import { ParticipantsView } from "@/components/provider/ParticipantsView";

export const metadata: Metadata = { title: "Check-in" };

interface PageProps {
  searchParams: Promise<{ session?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { session } = await searchParams;
  return <ParticipantsView initialSessionId={Array.isArray(session) ? session[0] : session} />;
}
