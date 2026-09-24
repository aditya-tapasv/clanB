import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error, options, children, ...props },
  ref,
) {
  return (
    <div className="w-full">
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 pr-10 text-sm text-white transition duration-200 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-ink text-white">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>
      {error && (
        <p id={props.id ? `${props.id}-error` : undefined} role="alert" className="mt-1 text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
});
