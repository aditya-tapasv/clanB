"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { VENDOR_FORM } from "@/content/leadForms";
import { applyAsVendor } from "@/lib/api/vendors";
import { track } from "@/lib/analytics";
import { LeadSuccess } from "./LeadSuccess";
import { EMAIL_PATTERN, PHONE_PATTERN } from "./validators";

interface VendorValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  gameType: string;
  experience: string;
  venueAvailable: string;
  message: string;
}

const EMPTY: VendorValues = { name: "", email: "", phone: "", city: "", gameType: "", experience: "", venueAvailable: "", message: "" };

export function BecomeVendorForm() {
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VendorValues>({ defaultValues: EMPTY });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: VendorValues) => {
    setSubmitError(null);
    try {
      const { reference } = await applyAsVendor(values);
      track("lead_form_submit", { form: "vendor" });
      setReference(reference);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't submit right now. Please try again.");
    }
  };

  if (reference) {
    return (
      <LeadSuccess
        heading={VENDOR_FORM.successHeading}
        body={VENDOR_FORM.successBody}
        reference={reference}
        resetLabel="Submit another application"
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
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone", { required: "Enter your phone number.", pattern: PHONE_PATTERN })}
          />
        </div>
        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-white">
            City
          </label>
          <Input id="city" autoComplete="address-level2" error={errors.city?.message} {...register("city", { required: "Enter your city." })} />
        </div>
        <div>
          <label htmlFor="gameType" className="mb-1.5 block text-sm font-medium text-white">
            Type of games
          </label>
          <Select id="gameType" error={errors.gameType?.message} {...register("gameType", { required: "Choose one." })}>
            <option value="" disabled>
              Select an option
            </option>
            {VENDOR_FORM.gameTypes.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="experience" className="mb-1.5 block text-sm font-medium text-white">
            Experience
          </label>
          <Select id="experience" error={errors.experience?.message} {...register("experience", { required: "Choose one." })}>
            <option value="" disabled>
              Select an option
            </option>
            {VENDOR_FORM.experience.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="venueAvailable" className="mb-1.5 block text-sm font-medium text-white">
            Venue available?
          </label>
          <Select
            id="venueAvailable"
            className="md:max-w-xs"
            error={errors.venueAvailable?.message}
            {...register("venueAvailable", { required: "Choose one." })}
          >
            <option value="" disabled>
              Select an option
            </option>
            {VENDOR_FORM.venueAvailable.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white">
          Message <span className="text-mist">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Anything else we should know?"
          className="w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 text-sm text-white transition duration-200 placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70"
          {...register("message")}
        />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-rose-400">
          {submitError}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
