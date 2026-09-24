"use client";

import "./globals.css";

/** Catches errors in the root layout itself; must render its own <html>/<body>. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[#030706] px-4 text-white">
        <main className="max-w-md text-center">
          <h1 className="text-3xl font-semibold">Clan B hit a snag</h1>
          <p className="mt-3 text-[#A8A29E]">Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-6 rounded-full bg-[#5CF111] px-5 py-2.5 text-sm font-semibold text-[#030706]"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
