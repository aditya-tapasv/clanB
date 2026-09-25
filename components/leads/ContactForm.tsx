"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CONTACT_FORM } from "@/content/leadForms";
import { submitLead } from "@/lib/leads";
import { track } from "@/lib/analytics";
import { LeadSuccess } from "./LeadSuccess";
import { EMAIL_PATTERN } from "./validators";

interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ defaultValues: EMPTY });

  const onSubmit = async (values: ContactValues) => {
    const { reference } = await submitLead("contact", { ...values });
    track("lead_form_submit", { form: "contact" });
    setReference(reference);
  };

  if (reference) {
    return (
      <LeadSuccess
        heading={CONTACT_FORM.successHeading}
        body={CONTACT_FORM.successBody}
        reference={reference}
        resetLabel="Send another message"
        onReset={() => {
          reset(EMPTY);
          setReference(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
            Name
          </label>
          <Input id="name" autoComplete="name" error={errors.name?.message} {...register("name", { required: "Enter your name." })} />
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
            {...register("email", { required: "Enter your email.", pattern: EMAIL_PATTERN })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-white">
          Subject
        </label>
        <Input id="subject" error={errors.subject?.message} {...register("subject", { required: "Enter a subject." })} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 text-sm text-white transition duration-200 placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70 aria-[invalid=true]:border-rose-500/70"
          {...register("message", { required: "Write a message.", minLength: { value: 10, message: "A little more detail helps (10+ characters)." } })}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-rose-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
