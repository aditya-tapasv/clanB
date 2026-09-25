"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PARTNER_FORM } from "@/content/leadForms";
import { submitLead } from "@/lib/leads";
import { track } from "@/lib/analytics";
import { LeadSuccess } from "./LeadSuccess";
import { CheckboxGroup } from "./CheckboxGroup";
import { EMAIL_PATTERN, PHONE_PATTERN } from "./validators";

interface PartnerValues {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  message: string;
}

const EMPTY: PartnerValues = { businessName: "", contactPerson: "", email: "", phone: "", businessType: "", location: "", message: "" };

export function PartnerForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerValues>({ defaultValues: EMPTY });

  const toggleService = (option: string) => {
    setServices((prev) => (prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]));
    setServicesError(null);
  };

  const onSubmit = async (values: PartnerValues) => {
    if (services.length === 0) {
      setServicesError("Choose at least one service.");
      return;
    }
    const { reference } = await submitLead("partner", { ...values, services: services.join(", ") });
    track("lead_form_submit", { form: "partner" });
    setReference(reference);
  };

  if (reference) {
    return (
      <LeadSuccess
        heading={PARTNER_FORM.successHeading}
        body={PARTNER_FORM.successBody}
        reference={reference}
        resetLabel="Submit another enquiry"
        onReset={() => {
          reset(EMPTY);
          setServices([]);
          setReference(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-white">
            Business name
          </label>
          <Input id="businessName" error={errors.businessName?.message} {...register("businessName", { required: "Enter your business name." })} />
        </div>
        <div>
          <label htmlFor="contactPerson" className="mb-1.5 block text-sm font-medium text-white">
            Contact person
          </label>
          <Input id="contactPerson" autoComplete="name" error={errors.contactPerson?.message} {...register("contactPerson", { required: "Enter a contact name." })} />
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
            {...register("email", { required: "Enter an email.", pattern: EMAIL_PATTERN })}
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
            {...register("phone", { required: "Enter a phone number.", pattern: PHONE_PATTERN })}
          />
        </div>
        <div>
          <label htmlFor="businessType" className="mb-1.5 block text-sm font-medium text-white">
            Business type
          </label>
          <Select id="businessType" error={errors.businessType?.message} {...register("businessType", { required: "Choose one." })}>
            <option value="" disabled>
              Select an option
            </option>
            {PARTNER_FORM.businessTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-white">
            Location
          </label>
          <Input id="location" autoComplete="address-level2" error={errors.location?.message} {...register("location", { required: "Enter a location." })} />
        </div>
      </div>

      <CheckboxGroup legend="Services" options={PARTNER_FORM.services} selected={services} onToggle={toggleService} error={servicesError ?? undefined} />

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white">
          Message <span className="text-mist">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Tell us more about your business and what you're looking for."
          className="w-full rounded-xl border border-white/15 bg-ink-soft px-4 py-2.5 text-sm text-white transition duration-200 placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70"
          {...register("message")}
        />
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
