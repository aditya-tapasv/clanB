"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { CONTACT_FORM } from "@/content/leadForms";
import { submitContactQuery } from "@/lib/api/contact";
import { track } from "@/lib/analytics";

interface ContactValues {
  name: string;
  query: string;
}

const EMPTY: ContactValues = { name: "", query: "" };

/** Contact Us: Name + Query → admin. Confirms with a popup, then clears the form. */
export function ContactForm() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ defaultValues: EMPTY });

  const onSubmit = async (values: ContactValues) => {
    setSubmitError(null);
    try {
      await submitContactQuery({ name: values.name.trim(), query: values.query.trim() });
      track("lead_form_submit", { form: "contact" });
      reset(EMPTY);
      setPopupOpen(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't send your query. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
            Name
          </label>
          <Input id="name" autoComplete="name" error={errors.name?.message} {...register("name", { required: "Enter your name." })} />
        </div>

        <div>
          <label htmlFor="query" className="mb-1.5 block text-sm font-medium text-white">
            Query
          </label>
          <textarea
            id="query"
            rows={6}
            placeholder="How can we help?"
            aria-invalid={errors.query ? true : undefined}
            aria-describedby={errors.query ? "query-error" : undefined}
            className="w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 text-sm text-white transition duration-200 placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70 aria-[invalid=true]:border-rose-500/70"
            {...register("query", {
              required: "Write your query.",
              minLength: { value: 10, message: "A little more detail helps (10+ characters)." },
            })}
          />
          {errors.query && (
            <p id="query-error" role="alert" className="mt-1 text-xs text-rose-400">
              {errors.query.message}
            </p>
          )}
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-rose-400">
            {submitError}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </form>

      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} title={CONTACT_FORM.popupTitle} hideTitle>
        <div role="status" className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-signal" aria-hidden="true" />
          {/* Visible heading; the dialog already exposes the same title to screen readers. */}
          <p aria-hidden="true" className="font-display text-2xl font-semibold text-white">
            {CONTACT_FORM.popupTitle}
          </p>
          <p className="text-sm leading-relaxed text-mist">{CONTACT_FORM.popupBody}</p>
          <Button type="button" variant="primary" onClick={() => setPopupOpen(false)} className="mt-2">
            Done
          </Button>
        </div>
      </Dialog>
    </>
  );
}
