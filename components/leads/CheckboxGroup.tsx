import React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxGroupProps {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
  error?: string;
  optional?: boolean;
}

/** Multi-select field rendered as toggle chips; the parent form owns the selected array. */
export function CheckboxGroup({ legend, options, selected, onToggle, error, optional }: CheckboxGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-white">
        {legend} {optional && <span className="font-normal text-mist">(optional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition duration-200",
                on
                  ? "border-signal bg-signal/15 text-signal"
                  : "border-white/15 bg-white/5 text-mist hover:border-white/30 hover:text-white"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-rose-400">
          {error}
        </p>
      )}
    </fieldset>
  );
}
