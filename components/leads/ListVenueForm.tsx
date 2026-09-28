"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { VENUE_FORM } from "@/content/leadForms";
import { submitVenueListing } from "@/lib/api/venueListings";
import { track } from "@/lib/analytics";
import { LeadSuccess } from "./LeadSuccess";
import { CheckboxGroup } from "./CheckboxGroup";
import { EMAIL_PATTERN, PHONE_PATTERN } from "@/lib/validators";

interface VenueValues {
  venueName: string;
  owner: string;
  location: string;
  capacity: string;
  email: string;
  phone: string;
}

const EMPTY: VenueValues = { venueName: "", owner: "", location: "", capacity: "", email: "", phone: "" };

export function ListVenueForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VenueValues>({ defaultValues: EMPTY });

  const toggleFacility = (option: string) => {
    setFacilities((prev) => (prev.includes(option) ? prev.filter((f) => f !== option) : [...prev, option]));
  };

  const onSubmit = async (values: VenueValues) => {
    setSubmitError(null);
    try {
      const { reference } = await submitVenueListing({ ...values, capacity: Number(values.capacity), facilities });
      track("lead_form_submit", { form: "venue" });
      setReference(reference);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't submit right now. Please try again.");
    }
  };

  if (reference) {
    return (
      <LeadSuccess
        heading={VENUE_FORM.successHeading}
        body={VENUE_FORM.successBody}
        reference={reference}
        resetLabel="List another venue"
        onReset={() => {
          reset(EMPTY);
          setFacilities([]);
          setReference(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="venueName" className="mb-1.5 block text-sm font-medium text-white">
            Venue name
          </label>
          <Input id="venueName" error={errors.venueName?.message} {...register("venueName", { required: "Enter the venue name." })} />
        </div>
        <div>
          <label htmlFor="owner" className="mb-1.5 block text-sm font-medium text-white">
            Owner
          </label>
          <Input id="owner" autoComplete="name" error={errors.owner?.message} {...register("owner", { required: "Enter the owner's name." })} />
        </div>
        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-white">
            Location
          </label>
          <Input id="location" autoComplete="address-level2" error={errors.location?.message} {...register("location", { required: "Enter a location." })} />
        </div>
        <div>
          <label htmlFor="capacity" className="mb-1.5 block text-sm font-medium text-white">
            Capacity
          </label>
          <Input
            id="capacity"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Number of people"
            error={errors.capacity?.message}
            {...register("capacity", { required: "Enter a capacity.", min: { value: 1, message: "Must be at least 1." } })}
          />
        </div>
      </div>

      <CheckboxGroup legend="Available facilities" options={VENUE_FORM.facilities} selected={facilities} onToggle={toggleFacility} optional />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-white">Contact information</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs text-mist">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email", { required: "Enter an email.", pattern: EMAIL_PATTERN })}
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs text-mist">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone", { required: "Enter a phone number.", pattern: PHONE_PATTERN })}
            />
          </div>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-rose-400">
          {submitError}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Submit venue"}
      </Button>
    </form>
  );
}
