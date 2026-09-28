"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeading, LoadingRows, Panel } from "@/components/dashboard/ui";
import { useSession } from "@/components/auth/SessionProvider";
import { listUsers, setUserRole } from "@/lib/api/admin";
import type { AdminUser } from "@/lib/api/types";
import { ROLE_LABEL, type Role } from "@/lib/auth/roles";
import { formatDate } from "@/lib/format";

/** Users & roles: the admin can promote a player to vendor (or admin) and back. */
export function UsersTable() {
  const { user: me } = useSession();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listUsers().then(setUsers);
  }, []);

  const changeRole = async (id: string, role: Role) => {
    setError(null);
    try {
      await setUserRole(id, role);
      setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, role } : u)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change the role.");
    }
  };

  return (
    <>
      <DashboardHeading
        eyebrow="Access"
        title="Users & roles"
        description="Roles decide where people land after login: admins → admin dashboard, vendors → vendor workspace, players → the site."
      />
      {error && (
        <p role="alert" className="mb-4 text-sm text-rose-400">
          {error}
        </p>
      )}
      <Panel>
        {!users ? (
          <LoadingRows />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <th className="px-5 py-3 font-normal">Name</th>
                  <th className="px-5 py-3 font-normal">Contact</th>
                  <th className="px-5 py-3 font-normal">Joined</th>
                  <th className="px-5 py-3 font-normal">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-medium text-white">{u.name}</td>
                    <td className="px-5 py-3 text-mist">{u.email ?? u.phone}</td>
                    <td className="px-5 py-3 text-mist">{formatDate(u.joinedAt)}</td>
                    <td className="px-5 py-3">
                      <label className="sr-only" htmlFor={`role-${u.id}`}>
                        Role for {u.name}
                      </label>
                      <select
                        id={`role-${u.id}`}
                        value={u.role}
                        disabled={u.email === me?.email && u.role === "admin"}
                        onChange={(e) => void changeRole(u.id, e.target.value as Role)}
                        className="rounded-lg border border-white/15 bg-ink-soft px-2.5 py-1.5 text-xs text-white focus:border-signal/70 focus:outline-none disabled:opacity-50"
                      >
                        {(["user", "vendor", "admin"] as const).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
