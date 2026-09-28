/**
 * Dummy backend state shared by the mock API (lives for the browser tab). Form POSTs add to it,
 * so a submission shows up in the admin dashboard straight away. Seeded with fictional records.
 * Delete this file once every "Dummy data" block in lib/api is replaced by the real API.
 */
import type {
  AdminContactQuery,
  AdminPartnerEnquiry,
  AdminUser,
  AdminVendorApplication,
  AdminVenueListing,
} from "./types";

const at = (daysAgo: number, hour = 11) => new Date(Date.UTC(2026, 8, 27 - daysAgo, hour - 5, 30)).toISOString();

export const mockStore = {
  vendors: [
    { id: "vnd_1", reference: "CB-VND-7K2Q", receivedAt: at(0), status: "pending", name: "Rohan Mehta", email: "rohan.m@example.com", phone: "+919876500011", city: "Bengaluru", gameType: "Board Games", experience: "1–3 years", venueAvailable: "No, I need one", message: "Run a weekly Catan + Azul night for 16 people." },
    { id: "vnd_2", reference: "CB-VND-3PLM", receivedAt: at(1), status: "pending", name: "Sneha Iyer", email: "sneha.coach@example.com", phone: "+919845000022", city: "Bengaluru", gameType: "Sports", experience: "3+ years", venueAvailable: "Yes, I have a venue" },
    { id: "vnd_3", reference: "CB-VND-9QXA", receivedAt: at(4), status: "approved", name: "Arjun Rao", email: "arjun.chess@example.com", phone: "+919900000033", city: "Chennai", gameType: "Board Games", experience: "3+ years", venueAvailable: "Not sure yet" },
  ] as AdminVendorApplication[],
  partners: [
    { id: "ptr_1", reference: "CB-PTR-4HTE", receivedAt: at(0, 15), status: "pending", businessName: "Shuttle Up Academy", contactPerson: "Kavya N", email: "hello@shuttleup.example", phone: "+919811100044", businessType: "Sports Club / Academy", location: "HSR Layout, Bengaluru", services: ["Coaching", "Tournaments"] },
    { id: "ptr_2", reference: "CB-PTR-8WQD", receivedAt: at(3), status: "approved", businessName: "Northwind Tech", contactPerson: "Farhan Ali", email: "people@northwind.example", phone: "+919822200055", businessType: "Corporate", location: "Whitefield, Bengaluru", services: ["Corporate Events", "Game Nights"], message: "Quarterly offsite playdays for ~120 staff." },
  ] as AdminPartnerEnquiry[],
  venueListings: [
    { id: "ven_1", reference: "CB-VEN-2ZKR", receivedAt: at(1, 17), status: "pending", venueName: "The Dice Den", owner: "Meera Pillai", location: "Jayanagar, Bengaluru", capacity: 40, facilities: ["WiFi", "Air Conditioning", "Refreshments / Café"], email: "meera@diceden.example", phone: "+919833300066" },
    { id: "ven_2", reference: "CB-VEN-6YUB", receivedAt: at(6), status: "rejected", venueName: "Court 9", owner: "Vikram S", location: "JP Nagar, Bengaluru", capacity: 12, facilities: ["Parking", "Changing Rooms"], email: "vikram@court9.example", phone: "+919844400077" },
  ] as AdminVenueListing[],
  queries: [
    { id: "msg_1", reference: "CB-MSG-5TRE", receivedAt: at(0, 9), status: "open", name: "Ananya", query: "Do you run beginner-friendly board game nights on weekdays?" },
    { id: "msg_2", reference: "CB-MSG-1NBV", receivedAt: at(2), status: "resolved", name: "Karthik", query: "Can I get a GST invoice for last week's badminton booking?" },
  ] as AdminContactQuery[],
  users: [
    { id: "usr_admin", name: "Admin", email: "admin@clanb.in", role: "admin", joinedAt: at(120) },
    { id: "usr_vendor", name: "Vendor", email: "vendor@clanb.in", role: "vendor", joinedAt: at(60) },
    { id: "usr_3", name: "Ananya", phone: "+919876512345", role: "user", joinedAt: at(9) },
    { id: "usr_4", name: "Karthik", email: "karthik@example.com", role: "user", joinedAt: at(21) },
  ] as AdminUser[],
};
