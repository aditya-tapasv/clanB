import React from "react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export interface AuthPageProps {
  mode: "login" | "signup";
  next?: string;
}

export function AuthPage({ mode, next }: AuthPageProps) {
  return (
    <InteriorPageLayout>
      <section className="relative overflow-hidden pb-24 pt-[calc(72px+4rem)]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[720px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(92,241,17,0.12),_transparent_70%)] blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative mx-auto max-w-md px-4">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            {mode === "login" ? "Welcome back" : "Join Clan B"}
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">
            {mode === "login" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-3 text-mist">
            {mode === "login"
              ? "Pick up your bookings, saves and follows."
              : "Book sessions, follow hosts and keep your receipts in one place."}
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-panel p-6">
            <AuthForm mode={mode} next={next} />
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">
            You can browse everything without an account — we only ask when you book.
          </p>
        </div>
      </section>
    </InteriorPageLayout>
  );
}
