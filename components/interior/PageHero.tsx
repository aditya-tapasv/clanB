"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { RevealHeadline } from "@/components/motion/RevealHeadline";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  sub,
  actions,
  badge,
  breadcrumbs,
  className,
  children,
}: PageHeroProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden pt-[calc(72px+4rem)] pb-12 border-b border-white/[0.06]",
        className
      )}
    >
      {/* Background radial wash & grid pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-[radial-gradient(ellipse_at_center,_rgba(92,241,17,0.12),_rgba(34,211,238,0.06),_transparent_70%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumbs" className="mb-6 flex items-center gap-1.5 text-xs text-mist">
            <Link href="/" className="hover:text-white transition-colors duration-150">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="h-3 w-3 text-white/30" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors duration-150">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="max-w-3xl">
          {/* Eyebrow & Badge row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {eyebrow && (
              <span className="text-xs uppercase tracking-[0.28em] font-mono text-signal">
                {eyebrow}
              </span>
            )}
            {badge}
          </div>

          {/* Reveal Title */}
          <RevealHeadline
            as="h1"
            text={title}
            className="font-display font-semibold tracking-tight text-balance text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08]"
          />

          {/* Subtitle */}
          {sub && (
            <p className="mt-4 text-base sm:text-lg text-mist leading-relaxed max-w-2xl text-balance">
              {sub}
            </p>
          )}

          {/* Actions */}
          {actions && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {actions}
            </div>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </header>
  );
}
