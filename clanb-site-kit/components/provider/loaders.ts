import { repo } from "@/lib/data/repo";

/** Stable loaders for useProviderData (module scope = referentially stable). */
export const loadDashboard = (orgId: string) => repo.getProviderDashboard(orgId);
export const loadSessions = (orgId: string) =>
  Promise.all([repo.listProviderSessions(orgId), repo.listProviderServices(orgId)]).then(([sessions, services]) => ({
    sessions,
    services,
  }));
export const loadBookings = (orgId: string) => repo.listProviderBookings(orgId);
export const loadAnnouncementsData = (orgId: string) =>
  Promise.all([repo.listAnnouncements(orgId), repo.listProviderSessions(orgId)]).then(([announcements, sessions]) => ({
    announcements,
    sessions,
  }));
export const loadInventory = (orgId: string) => repo.getProviderInventory(orgId);
export const loadPayouts = (orgId: string) => repo.listPayouts(orgId);
export const loadInsights = (orgId: string) => repo.getProviderInsights(orgId);
export const loadCreateOptions = (orgId: string) =>
  Promise.all([repo.listSports(), repo.listGames(), repo.listVenues(), repo.getProviderInventory(orgId)]).then(
    ([sports, games, venues, inventory]) => ({ activities: [...games, ...sports], venues, inventory })
  );
