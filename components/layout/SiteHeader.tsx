"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  Dices,
  Building2,
  Handshake,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { AccountMenu, initials } from "@/components/auth/AccountMenu";
import { useSession } from "@/components/auth/SessionProvider";
import { ROLE_HOME } from "@/lib/auth/roles";
import { cn } from "@/lib/cn";

const NAV_LINKS = [{ label: "Venues", href: "/venues" }];

const SERVICE_LINKS = [
  {
    title: "Become a Vendor",
    desc: "Run sessions & coaching",
    href: "/services/vendor",
    icon: Dices,
  },
  {
    title: "Partner with Clan B",
    desc: "Vendors, organizers & corporates",
    href: "/services/partner",
    icon: Handshake,
  },
  {
    title: "List Your Venue",
    desc: "Monetize tables, courts & rooms",
    href: "/services/list-venue",
    icon: Building2,
  },
  {
    title: "Contact Us",
    desc: "General questions & enquiries",
    href: "/contact",
    icon: Mail,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [mobileProviderOpen, setMobileProviderOpen] = useState(false);
  const { user, logout } = useSession();

  // Passive scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileNavigation = () => {
    setMobileMenuOpen(false);
    setMobileProviderOpen(false);
  };

  const isTransparent = isHome && !scrolled && !mobileMenuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          isTransparent
            ? "bg-transparent"
            : "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
        )}
      >
        <div className="page-shell page-x flex h-[72px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            {/* Logo + brand tagline (homepage only) */}
            <div className="flex flex-col">
              <Logo height={24} priority={isHome} />
              {isHome && (
                <span className="mt-1 pl-0.5 text-[10px] italic leading-none tracking-[0.08em] text-mist">
                  The future of <span className="text-signal">games.</span>
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-white",
                      isActive ? "text-white font-semibold" : "text-white/70"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProviderDropdownOpen(true)}
                onMouseLeave={() => setProviderDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white",
                    pathname.startsWith("/services") || pathname === "/contact"
                      ? "text-white font-semibold"
                      : "text-white/70"
                  )}
                  aria-expanded={providerDropdownOpen}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      providerDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                <div
                  className={cn(
                    "absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-4 transition duration-200",
                    providerDropdownOpen
                      ? "pointer-events-auto opacity-100 translate-y-0"
                      : "pointer-events-none opacity-0 -translate-y-1"
                  )}
                >
                  <div className="max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-white/10 bg-ink-soft/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="space-y-1">
                      {SERVICE_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-white/5"
                          >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-signal group-hover:border-signal/40 group-hover:bg-signal/10">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white group-hover:text-signal transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-mist">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right Action Cluster */}
          <div className="hidden items-center gap-3 lg:flex">
            <AccountMenu />

            {/* Explore Venues */}
            <Button
              href="/venues"
              variant="primary"
              withArrow
              className="px-4 py-2 text-xs"
            >
              Explore Venues
            </Button>
          </div>

          {/* Mobile Right Controls: Account + Burger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={user ? ROLE_HOME[user.role] : "/login"}
              aria-label={user ? "My account" : "Login or register"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              {user ? (
                <span className="font-mono text-xs font-bold text-signal">{initials(user.name)}</span>
              ) : (
                <LogIn className="h-4 w-4 text-signal" />
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-ink/95 page-x py-6 backdrop-blur-xl lg:hidden">
            <div className="space-y-4">
              <nav aria-label="Mobile" className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileNavigation}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                  </Link>
                ))}

                {/* Services Accordion */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02]">
                  <button
                    onClick={() => setMobileProviderOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between px-4 py-3 text-base font-medium text-white"
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-400 transition-transform duration-200",
                        mobileProviderOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {mobileProviderOpen && (
                    <div className="border-t border-white/10 px-4 py-2 space-y-1">
                      {SERVICE_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileNavigation}
                          className="block rounded-lg px-3 py-2 text-sm text-mist hover:bg-white/5 hover:text-white"
                        >
                          <div className="font-medium text-white">{item.title}</div>
                          <div className="text-xs text-zinc-500">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/about"
                  onClick={closeMobileNavigation}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  About Clan B
                </Link>
                <Link
                  href="/help"
                  onClick={closeMobileNavigation}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  Help & Support
                </Link>
              </nav>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                {user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button href={ROLE_HOME[user.role]} variant="ghost" className="justify-center" onClick={closeMobileNavigation}>
                      {user.role === "user" ? "My account" : "Dashboard"}
                    </Button>
                    <Button type="button" variant="ghost" className="justify-center" onClick={() => void logout()}>
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button href="/login" variant="ghost" className="w-full justify-center" onClick={closeMobileNavigation}>
                    Login / Register
                  </Button>
                )}
                <Button
                  href="/venues"
                  variant="primary"
                  withArrow
                  className="w-full justify-center"
                  onClick={closeMobileNavigation}
                >
                  Explore Venues
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

    </>
  );
}
