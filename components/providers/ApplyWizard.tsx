"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { CheckCircle2, FileUp, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { APPLY_CONTENT, type ProviderTypeId } from "@/content/providers";

const DRAFT_KEY = "clanb.mock.provider-apply.v1";

interface ApplyValues {
  orgName: string;
  orgDescription: string;
  neighbourhood: string;
  website: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  providerType: ProviderTypeId | "";
  activities: string[];
  documents: Record<string, string>;
  agree: boolean;
}

const EMPTY: ApplyValues = {
  orgName: "",
  orgDescription: "",
  neighbourhood: "",
  website: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  providerType: "",
  activities: [],
  documents: {},
  agree: false,
};

const STEP_FIELDS: FieldPath<ApplyValues>[][] = [
  ["orgName", "orgDescription", "neighbourhood", "website"],
  ["contactName", "role", "email", "phone"],
  ["providerType", "activities"],
  ["documents"],
  ["agree"],
];

interface Draft {
  step: number;
  values: ApplyValues;
}

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white">
        {label} {optional && <span className="text-mist">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export function ApplyWizard({ initialType }: { initialType?: ProviderTypeId }) {
  const [draft] = useState<Draft | null>(() => readDraft());
  const [step, setStep] = useState(draft?.step ?? 0);
  const [reference, setReference] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ApplyValues>({
    defaultValues: {
      ...EMPTY,
      ...draft?.values,
      providerType: draft?.values.providerType || initialType || "",
    },
  });

  const values = useWatch({ control }) as ApplyValues;
  const docsError = typeof errors.documents?.message === "string" ? errors.documents.message : undefined;

  // Persist progress (VEN-01: "saves progress").
  useEffect(() => {
    if (reference) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values }));
    } catch {
      // Storage blocked: progress lasts for this visit only.
    }
  }, [step, values, reference]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const next = async () => {
    if (await trigger(STEP_FIELDS[step])) setStep((s) => Math.min(s + 1, APPLY_CONTENT.steps.length - 1));
  };

  const submit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setReference(`APP-${getValues("orgName").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "CLNB"}-${String(getValues("phone")).slice(-4) || "0000"}`);
  };

  if (reference) {
    return (
      <div role="status" className="space-y-5 rounded-2xl border border-signal/30 bg-panel p-8">
        <CheckCircle2 className="h-10 w-10 text-signal" aria-hidden="true" />
        <h2 className="font-display text-2xl font-semibold text-white">Application received</h2>
        <p className="text-mist">
          Thanks, {values.contactName.split(" ")[0]}. Your reference is{" "}
          <span className="font-mono text-signal">{reference}</span>. We&apos;ll review your documents within two working
          days and email {values.email} with next steps.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/provider" variant="primary" withArrow>
            Preview the provider workspace
          </Button>
          <Button href="/for-providers" variant="ghost">
            Back to For Providers
          </Button>
        </div>
      </div>
    );
  }

  const selectedActivities = values.activities ?? [];
  const toggleActivity = (a: string) => {
    // Read the live value, not the render closure, so rapid clicks don't overwrite each other.
    const current = getValues("activities") ?? [];
    const nextList = current.includes(a) ? current.filter((x) => x !== a) : [...current, a];
    setValue("activities", nextList, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Application steps">
        {APPLY_CONTENT.steps.map((label, i) => (
          <li key={label} className="shrink-0">
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                i === step ? "bg-signal/10 text-white" : i < step ? "text-mist hover:bg-white/5" : "text-zinc-600"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                  i < step ? "border-signal bg-signal text-ink" : i === step ? "border-signal text-signal" : "border-white/15"
                )}
              >
                {i < step ? "✓" : i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
        <li className="hidden items-center gap-1.5 px-3 pt-4 font-mono text-[10px] text-zinc-500 lg:flex">
          <Save className="h-3 w-3" aria-hidden="true" /> Progress saves automatically
        </li>
      </ol>

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-white outline-none">
          {APPLY_CONTENT.steps[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-5">
            <Field id="orgName" label="Organisation or brand name">
              <Input id="orgName" error={errors.orgName?.message} {...register("orgName", { required: "Enter your organisation name." })} />
            </Field>
            <Field id="orgDescription" label="What do you run?">
              <textarea
                id="orgDescription"
                rows={4}
                aria-invalid={errors.orgDescription ? true : undefined}
                aria-describedby={errors.orgDescription ? "orgDescription-error" : undefined}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-signal/70 focus:outline-none focus:ring-1 focus:ring-signal/70 aria-[invalid=true]:border-rose-500/70"
                placeholder="e.g. Weekly strategy nights for 20–30 players in Koramangala."
                {...register("orgDescription", {
                  required: "Describe what you run.",
                  minLength: { value: 20, message: "A sentence or two, please (20+ characters)." },
                })}
              />
              {errors.orgDescription && (
                <p id="orgDescription-error" role="alert" className="mt-1 text-xs text-rose-400">
                  {errors.orgDescription.message}
                </p>
              )}
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="neighbourhood" label="Main area">
                <Select id="neighbourhood" error={errors.neighbourhood?.message} {...register("neighbourhood", { required: "Choose an area." })}>
                  <option value="" disabled>
                    Select an area
                  </option>
                  {APPLY_CONTENT.neighbourhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="website" label="Website or Instagram" optional>
                <Input id="website" placeholder="https://" {...register("website")} />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="contactName" label="Your name">
              <Input id="contactName" autoComplete="name" error={errors.contactName?.message} {...register("contactName", { required: "Enter your name." })} />
            </Field>
            <Field id="role" label="Your role" optional>
              <Input id="role" placeholder="Owner, manager, host…" {...register("role")} />
            </Field>
            <Field id="email" label="Work email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Enter your email.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
                })}
              />
            </Field>
            <Field id="phone" label="Mobile number">
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone", {
                  required: "Enter a mobile number.",
                  validate: (v) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, "")) || "Enter a valid 10-digit Indian mobile number.",
                })}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-white">Provider type</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {APPLY_CONTENT.providerTypes.map((t) => (
                  <label
                    key={t.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                      values.providerType === t.id ? "border-signal bg-signal/10 text-white" : "border-white/10 text-mist hover:border-white/25"
                    )}
                  >
                    <input
                      type="radio"
                      value={t.id}
                      className="accent-[#5CF111]"
                      {...register("providerType", { required: "Choose what kind of provider you are." })}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
              {errors.providerType && (
                <p role="alert" className="mt-2 text-xs text-rose-400">
                  {errors.providerType.message}
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-white">Activities you run</legend>
              <input type="hidden" {...register("activities", { validate: (v) => v.length > 0 || "Pick at least one activity." })} />
              <div className="flex flex-wrap gap-2">
                {APPLY_CONTENT.activities.map((a) => {
                  const on = selectedActivities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleActivity(a)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs transition",
                        on ? "bg-signal font-semibold text-ink" : "border border-white/10 bg-white/5 text-mist hover:text-white"
                      )}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
              {errors.activities && (
                <p role="alert" className="mt-2 text-xs text-rose-400">
                  {errors.activities.message}
                </p>
              )}
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-mist">
              Upload clear photos or PDFs. Files stay on your device in this preview — nothing is uploaded.
            </p>
            <input
              type="hidden"
              {...register("documents", {
                validate: (d) => APPLY_CONTENT.documents.every((doc) => d?.[doc.id]) || "Add all three documents to continue.",
              })}
            />
            {APPLY_CONTENT.documents.map((doc) => {
              const fileName = values.documents?.[doc.id];
              return (
                <div key={doc.id} className="flex flex-col gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{doc.label}</p>
                    <p className="text-xs text-mist">{fileName ? `✓ ${fileName}` : doc.hint}</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white transition hover:border-signal focus-within:outline-2 focus-within:outline-signal">
                    <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {fileName ? "Replace" : "Choose file"}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="sr-only"
                      aria-label={doc.label}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue("documents", { ...getValues("documents"), [doc.id]: file.name }, { shouldValidate: true });
                        }
                      }}
                    />
                  </label>
                </div>
              );
            })}
            {docsError && (
              <p role="alert" className="text-xs text-rose-400">
                {docsError}
              </p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Organisation", values.orgName],
                ["Area", values.neighbourhood],
                ["Contact", `${values.contactName}${values.role ? ` · ${values.role}` : ""}`],
                ["Email / phone", `${values.email} · ${values.phone}`],
                ["Provider type", APPLY_CONTENT.providerTypes.find((t) => t.id === values.providerType)?.label ?? "—"],
                ["Activities", selectedActivities.join(", ")],
                ["Documents", `${Object.keys(values.documents ?? {}).length} of ${APPLY_CONTENT.documents.length} added`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-mist">{k}</dt>
                  <dd className="mt-1 text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-white">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#5CF111]" {...register("agree", { required: "Confirm the details to submit." })} />
              I confirm these details are accurate and agree to Clan B&apos;s provider terms.
            </label>
            {errors.agree && (
              <p role="alert" className="text-xs text-rose-400">
                {errors.agree.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          {step < APPLY_CONTENT.steps.length - 1 ? (
            <Button type="button" variant="primary" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Submit application
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
