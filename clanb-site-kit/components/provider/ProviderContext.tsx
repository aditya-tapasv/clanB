"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { repo } from "@/lib/data/repo";
import type { Organization } from "@/lib/data/types";

const ORG_KEY = "clanb.mock.provider-org.v1";
const DEFAULT_ORG = "org-stratplay";

// Active organization: a tiny persisted store read through useSyncExternalStore (hydration-safe).
const listeners = new Set<() => void>();
let cachedOrg: string | undefined;

function readOrg(): string {
  if (cachedOrg) return cachedOrg;
  try {
    cachedOrg = window.localStorage.getItem(ORG_KEY) ?? DEFAULT_ORG;
  } catch {
    cachedOrg = DEFAULT_ORG;
  }
  return cachedOrg;
}

function setOrgId(id: string) {
  cachedOrg = id;
  try {
    window.localStorage.setItem(ORG_KEY, id);
  } catch {
    // Storage blocked: selection lasts for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

interface ProviderContextValue {
  orgId: string;
  org?: Organization;
  orgs: Organization[];
  setOrgId: (id: string) => void;
}

const Ctx = createContext<ProviderContextValue | null>(null);

export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const orgId = useSyncExternalStore(subscribe, readOrg, () => DEFAULT_ORG);
  const [orgs, setOrgs] = useState<Organization[]>([]);

  useEffect(() => {
    let cancelled = false;
    repo.listProviderOrganizations().then((list) => {
      if (!cancelled) setOrgs(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Ctx.Provider value={{ orgId, org: orgs.find((o) => o.id === orgId), orgs, setOrgId }}>{children}</Ctx.Provider>
  );
}

export function useProvider(): ProviderContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProvider must be used inside <ProviderProvider>");
  return ctx;
}

/**
 * Loads data for the active organization. Pass a module-level (stable) loader.
 * `loading` is derived from the key, so switching orgs never shows the previous org's data.
 */
export function useProviderData<T>(load: (orgId: string) => Promise<T>) {
  const { orgId } = useProvider();
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  const [nonce, setNonce] = useState(0);
  const key = `${orgId}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    load(orgId).then(
      (data) => {
        if (!cancelled) setState({ key: `${orgId}|${nonce}`, data });
      },
      (err: unknown) => {
        if (!cancelled) setState({ key: `${orgId}|${nonce}`, error: err instanceof Error ? err.message : "Failed to load" });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [load, orgId, nonce]);

  const fresh = state.key === key;
  return {
    // Keep showing the last data during a same-org reload to avoid flicker.
    data: fresh || state.key.startsWith(`${orgId}|`) ? state.data : undefined,
    error: fresh ? state.error : undefined,
    loading: !fresh,
    reload: () => setNonce((n) => n + 1),
  };
}
