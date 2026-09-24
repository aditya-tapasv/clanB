import { Metadata } from "next";
import { InventoryView } from "@/components/provider/InventoryView";

export const metadata: Metadata = { title: "Inventory" };

export default function Page() {
  return <InventoryView />;
}
