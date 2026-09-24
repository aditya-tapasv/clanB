"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { REPORT_ISSUE_TYPES } from "@/content/help";

interface ReportIssueValues {
  issueType: string;
  bookingRef: string;
  email: string;
  details: string;
}

/** Mock support reference until the backend issues real ones. */
function makeReference(): string {
  return `CB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-rose-400">
      {message}
    </p>
  );
}

export function ReportIssueForm() {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportIssueValues>({
    defaultValues: { issueType: "", bookingRef: "", email: "", details: "" },
  });

  const onSubmit = async () => {
    // Mock submission — the support endpoint arrives with the NestJS backend.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setReference(makeReference());
  };

  if (reference) {
    return (
      <div role="status" className="space-y-4 rounded-2xl border border-signal/30 bg-panel p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-signal" aria-hidden="true" />
        <h2 className="font-display text-2xl font-semibold text-white">Report received</h2>
        <p className="text-sm text-mist">
          Your reference is <span className="font-mono text-signal">{reference}</span>. We&apos;ll review it within one
          working day and email you with next steps.
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset();
            setReference(null);
          }}
        >
          Report another issue
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
      <div>
        <label htmlFor="issueType" className="mb-1.5 block text-sm font-medium text-white">
          What went wrong?
        </label>
        <Select
          id="issueType"
          error={errors.issueType?.message}
          {...register("issueType", { required: "Choose the type of issue." })}
        >
          <option value="" disabled>
            Select an issue type
          </option>
          {REPORT_ISSUE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="bookingRef" className="mb-1.5 block text-sm font-medium text-white">
            Booking reference <span className="text-mist">(optional)</span>
          </label>
          <Input id="bookingRef" placeholder="e.g. CLB-7K2Q" {...register("bookingRef")} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Enter your email so we can reply.",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
            })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="mb-1.5 block text-sm font-medium text-white">
          Details
        </label>
        <textarea
          id="details"
          rows={5}
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "details-error" : undefined}
          placeholder="What happened, when, and what you'd like us to do."
          className="w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 text-sm text-white transition duration-200 placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70 aria-[invalid=true]:border-rose-500/70"
          {...register("details", {
            required: "Tell us what happened.",
            minLength: { value: 20, message: "Please add a little more detail (at least 20 characters)." },
          })}
        />
        <FieldError id="details-error" message={errors.details?.message} />
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Submit report"}
      </Button>
    </form>
  );
}
