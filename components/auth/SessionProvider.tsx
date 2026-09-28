"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSession, logout as logoutRequest } from "@/lib/api/auth";
import type { SessionUser } from "@/lib/auth/roles";

interface SessionState {
  user: SessionUser | null;
  status: "loading" | "ready";
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionState | null>(null);

/**
 * Client view of the session, fetched from /api/auth/session after load so every page can
 * stay statically rendered. The cookie itself is httpOnly and never readable here.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<SessionState["status"]>("loading");
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      setUser((await fetchSession()).user);
    } catch {
      setUser(null);
    } finally {
      setStatus("ready");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    fetchSession()
      .then((res) => !cancelled && setUser(res.user))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setStatus("ready"));
    return () => {
      cancelled = true;
    };
  }, []);

  return <SessionContext.Provider value={{ user, status, refresh, logout }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
