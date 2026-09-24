"use client";

import Link from "next/link";

/** Last-resort boundary: any runtime error in a page renders this instead of a blank screen. */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="max-w-md text-center">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Something went wrong</span>
        <h1 className="mt-3 font-display text-3xl font-semibold">We dropped a piece</h1>
        <p className="mt-3 text-mist">
          This page hit an unexpected error. Try again, or head back to the home page.
          {error.digest && <span className="mt-2 block font-mono text-xs text-zinc-400">Ref {error.digest}</span>}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Try again
          </button>
          <Link href="/" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white transition hover:border-white/30">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
