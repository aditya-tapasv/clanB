import React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", error, icon, ...props }, ref) {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition duration-200 focus:border-signal/70 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-signal/70 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            error && "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={props.id ? `${props.id}-error` : undefined} role="alert" className="mt-1 text-xs text-rose-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
