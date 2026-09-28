import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OtpAuthForm } from "@/components/auth/OtpAuthForm";

export const metadata: Metadata = {
  title: "Login or Register | Clan B",
  description: "Log in or create your Clan B account with a one-time code sent to your phone or email.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const { mode, next } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="main" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-[calc(72px+3rem)]">
        <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-30" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 blur-3xl"
          style={{ background: "radial-gradient(ellipse at center, rgba(92,241,17,0.14), rgba(255,255,255,0.03), transparent 70%)" }}
        />

        <div className="page-shell page-x relative grid items-center gap-12 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Clan B account</p>
            <h1 className="mt-4 max-w-[14ch] bg-gradient-to-b from-white to-zinc-400 bg-clip-text font-display text-5xl font-semibold leading-[1.08] tracking-tight text-transparent xl:text-6xl">
              One login for players, vendors and the team
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
              Players land back on the site with their bookings. Vendors open their workspace. The Clan B team goes
              straight to the admin dashboard.
            </p>
            <p className="mt-10 text-sm italic text-mist">
              The future of <span className="text-signal">games.</span>
            </p>
          </div>

          <div className="mx-auto w-full max-w-[440px]">
            <h1 className="mb-6 text-center font-display text-3xl font-semibold tracking-tight text-white lg:hidden">
              Login or register
            </h1>
            <OtpAuthForm initialMode={mode === "register" ? "register" : "login"} next={next ?? null} />
          </div>
        </div>
      </main>
    </>
  );
}
