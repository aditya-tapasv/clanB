import { Metadata } from "next";
import { notFound } from "next/navigation";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { repo, type SlotRequest } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Checkout | Clan B",
  robots: { index: false },
};

type Search = Record<string, string | string[] | undefined>;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Search>;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  let slot: SlotRequest | undefined;
  if (id.startsWith("slot-")) {
    const date = first(sp.date);
    const start = first(sp.start);
    if (!date || !start) notFound();
    slot = { venueId: id.slice("slot-".length), resourceId: first(sp.resource) ?? "", date, start };
  }

  const item = await repo.getCheckoutItem(id, slot);
  if (!item) notFound();

  const quantity = Number.parseInt(first(sp.quantity) ?? "1", 10);

  return (
    <InteriorPageLayout>
      <div className="container mx-auto max-w-6xl px-4 pb-24 pt-[calc(72px+3rem)] sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-3xl font-semibold text-white md:text-4xl">Checkout</h1>
        <CheckoutFlow item={item} initialQuantity={Number.isFinite(quantity) ? quantity : 1} slot={slot} />
      </div>
    </InteriorPageLayout>
  );
}
