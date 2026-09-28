"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSession } from "./SessionProvider";
import { confirmOtp, sendOtp } from "@/lib/api/auth";
import { normaliseIdentifier } from "@/lib/validators";
import type { OtpChannel } from "@/lib/auth/types";
import { cn } from "@/lib/cn";

type Mode = "login" | "register";

interface OtpAuthFormProps {
  initialMode: Mode;
  next: string | null;
}

/**
 * Passwordless login/register: phone or e-mail → 6-digit one-time code → session.
 * After verifying, the server says where this role lands (admin → /admin, vendor → /vendor,
 * player → /account or the page they came from).
 */
export function OtpAuthForm({ initialMode, next }: OtpAuthFormProps) {
  const { refresh } = useSession();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [channel, setChannel] = useState<OtpChannel>("phone");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [fieldError, setFieldError] = useState<{ name?: string; identifier?: string; code?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [devCode, setDevCode] = useState<string | undefined>();
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setFormError(null);
    setFieldError({});
  };

  const requestCode = async () => {
    const errors: typeof fieldError = {};
    if (mode === "register" && !name.trim()) errors.name = "Enter your name.";
    if (!normaliseIdentifier(channel, identifier)) {
      errors.identifier = channel === "phone" ? "Enter a valid 10-digit Indian mobile number." : "Enter a valid email address.";
    }
    setFieldError(errors);
    if (Object.keys(errors).length) return;

    setBusy(true);
    setFormError(null);
    try {
      const res = await sendOtp({ channel, identifier, purpose: mode, name: mode === "register" ? name.trim() : undefined });
      setDevCode(res.devCode);
      setResendIn(res.resendInSec);
      setCode("");
      setStep("code");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't send the code.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(code)) {
      setFieldError({ code: "Enter the 6-digit code." });
      return;
    }
    setBusy(true);
    setFormError(null);
    setFieldError({});
    try {
      const res = await confirmOtp({ channel, identifier, code, name: mode === "register" ? name.trim() : undefined, next });
      await refresh();
      window.location.assign(res.redirectTo);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't verify the code.");
      setBusy(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (step === "details" ? requestCode() : verify());
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-panel/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
      {/* Login / Register tabs */}
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            disabled={step === "code"}
            onClick={() => switchMode(m)}
            className={cn(
              "rounded-full py-2 text-sm font-medium transition disabled:cursor-not-allowed",
              mode === m ? "bg-signal text-ink" : "text-mist hover:text-white"
            )}
          >
            {m === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        {step === "details" ? (
          <>
            {mode === "register" && (
              <div>
                <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-white">
                  Full name
                </label>
                <Input id="auth-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={fieldError.name} />
              </div>
            )}

            <fieldset>
              <legend className="mb-1.5 block text-sm font-medium text-white">
                {mode === "login" ? "Log in with" : "Register with"}
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(["phone", "email"] as const).map((c) => {
                  const Icon = c === "phone" ? Phone : Mail;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={channel === c}
                      onClick={() => {
                        setChannel(c);
                        setIdentifier("");
                        setFieldError({});
                      }}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition",
                        channel === c
                          ? "border-signal bg-signal/15 text-signal"
                          : "border-white/15 bg-white/5 text-mist hover:border-white/30 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {c === "phone" ? "Phone number" : "Email"}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="auth-identifier" className="mb-1.5 block text-sm font-medium text-white">
                {channel === "phone" ? "Mobile number" : "Email address"}
              </label>
              <Input
                id="auth-identifier"
                type={channel === "phone" ? "tel" : "email"}
                inputMode={channel === "phone" ? "tel" : "email"}
                autoComplete={channel === "phone" ? "tel" : "email"}
                placeholder={channel === "phone" ? "98765 43210" : "you@example.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={fieldError.identifier}
              />
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setFormError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-mist transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Change {channel === "phone" ? "number" : "email"}
            </button>
            <div>
              <label htmlFor="auth-code" className="mb-1.5 block text-sm font-medium text-white">
                Enter the 6-digit code
              </label>
              <p className="mb-3 text-xs text-mist">
                Sent to <span className="text-white">{identifier}</span>
              </p>
              <Input
                ref={codeRef}
                id="auth-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                error={fieldError.code}
                className="text-center font-mono text-2xl tracking-[0.6em]"
              />
              {devCode && (
                <p className="mt-2 font-mono text-[11px] text-amber-500">Dev mode — your code is {devCode}</p>
              )}
            </div>
            <div className="text-xs text-mist">
              {resendIn > 0 ? (
                <span>Resend code in {resendIn}s</span>
              ) : (
                <button type="button" onClick={() => void requestCode()} className="text-signal hover:underline">
                  Resend code
                </button>
              )}
            </div>
          </>
        )}

        {formError && (
          <p role="alert" className="text-sm text-rose-400">
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={busy} className="w-full">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {step === "details" ? (busy ? "Sending code…" : "Send OTP") : busy ? "Verifying…" : mode === "login" ? "Verify & log in" : "Verify & create account"}
        </Button>
      </form>

      <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-zinc-500">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden="true" />
        No passwords. We send a one-time code each time you log in. Vendor and admin access is granted by the Clan B team.
      </p>
    </div>
  );
}
