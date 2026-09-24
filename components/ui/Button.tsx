import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "hero-primary" | "ghost" | "hero-ghost" | "signal-ghost";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export type ButtonProps = ButtonBaseProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
  "hero-primary":
    "inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-glow focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
  "hero-ghost":
    "inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700/80 bg-[#030706]/40 px-6 py-3.5 text-sm text-zinc-200 backdrop-blur-sm transition duration-300 hover:border-signal/50 hover:text-white focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
  "signal-ghost":
    "inline-flex items-center justify-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-5 py-3 text-sm font-medium text-signal transition duration-300 hover:bg-signal/20 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", withArrow = false, className, children, href, ...props }, ref) {
    const classes = cn("group cursor-pointer select-none", variantStyles[variant], className);

    const content = (
      <>
        {children}
        {withArrow && (
          <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);
