import { Metadata } from "next";
import { AnnouncementsView } from "@/components/provider/AnnouncementsView";

export const metadata: Metadata = { title: "Announcements" };

interface PageProps {
  searchParams: Promise<{ session?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { session } = await searchParams;
  return <AnnouncementsView initialSessionId={Array.isArray(session) ? session[0] : session} />;
}
