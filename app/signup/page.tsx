import { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Create account | Clan B",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <AuthPage mode="signup" next={Array.isArray(next) ? next[0] : next} />;
}
