import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found | Clan B",
};

/** Lime "b" tile grid — the logo tile motif, with one tile missing. */
function TileMotif() {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={
            i === 4
              ? "h-14 w-14 rounded-xl border border-dashed border-signal/40 md:h-16 md:w-16"
              : "flex h-14 w-14 items-center justify-center rounded-xl bg-signal font-display text-2xl font-bold text-ink md:h-16 md:w-16"
          }
        >
          {i === 4 ? null : "b"}
        </span>
      ))}
    </div>
  );
}

export default function NotFound() {
  return (
    <InteriorPageLayout>
      <section className="relative overflow-hidden pb-24 pt-[calc(72px+5rem)]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container relative mx-auto flex max-w-5xl flex-col items-start gap-12 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-lg">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Error 404</span>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-6xl">This tile is missing</h1>
            <p className="mt-4 text-lg text-mist">
              The page you were looking for has moved or never existed. Let&apos;s get you back to the table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/" variant="primary" withArrow>
                Back home
              </Button>
              <Button href="/play" variant="ghost">
                Find something to play
              </Button>
            </div>
          </div>
          <TileMotif />
        </div>
      </section>
    </InteriorPageLayout>
  );
}
