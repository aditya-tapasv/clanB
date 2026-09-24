import { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign in | Clan B",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <AuthPage mode="login" next={Array.isArray(next) ? next[0] : next} />;
}
