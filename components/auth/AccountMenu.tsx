"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { useSession } from "./SessionProvider";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/auth/roles";
import { cn } from "@/lib/cn";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Header auth control: "Login / Register" when signed out, an account menu when signed in. */
export function AccountMenu() {
  const { user, status, logout } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "loading") {
    return <div aria-hidden="true" className="h-[34px] w-[150px] animate-pulse rounded-full border border-white/10 bg-white/5" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-signal/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2"
      >
        <LogIn className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
        Login / Register
      </Link>
    );
  }

  const home = ROLE_HOME[user.role];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 text-xs font-medium text-white transition hover:border-white/30 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-bold text-ink">
          {initials(user.name)}
        </span>
        <span className="max-w-[9rem] truncate">{user.name}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 top-full mt-3 w-60 rounded-2xl border border-white/10 bg-ink-soft/95 p-2 shadow-2xl backdrop-blur-xl transition duration-200",
          open ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="border-b border-white/10 px-3 pb-3 pt-2">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs text-mist">{user.email ?? user.phone}</p>
          <span className="mt-2 inline-block rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
            {ROLE_LABEL[user.role]}
          </span>
        </div>
        <div className="pt-1">
          {home !== "/account" && (
            <MenuLink href={home} icon={LayoutDashboard} onSelect={() => setOpen(false)}>
              {user.role === "admin" ? "Admin dashboard" : "Vendor workspace"}
            </MenuLink>
          )}
          <MenuLink href="/account" icon={UserRound} onSelect={() => setOpen(false)}>
            My account
          </MenuLink>
          <button
            type="button"
            role="menuitem"
            onClick={() => void logout()}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-mist transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onSelect,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-mist transition hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
