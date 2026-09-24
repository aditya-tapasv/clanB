import { Metadata } from "next";
import { BookingsView } from "@/components/provider/BookingsView";

export const metadata: Metadata = { title: "Bookings" };

export default function Page() {
  return <BookingsView />;
}
