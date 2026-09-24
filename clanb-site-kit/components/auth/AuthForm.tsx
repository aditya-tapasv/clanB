"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { safeNext, signIn, type SessionUser } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Channel = "email" | "phone";

interface ContactValues {
  name: string;
  contact: string;
}

export interface AuthFormProps {
  mode: "login" | "signup";
  /** Where to go after sign-in; ignored when `onSignedIn` is given. */
  next?: string;
  /** Inline use (checkout): stay on the page and hand back the user. */
  onSignedIn?: (user: SessionUser) => void;
  className?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export function AuthForm({ mode, next, onSignedIn, className }: AuthFormProps) {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("email");
  const [sentTo, setSentTo] = useState<ContactValues | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ defaultValues: { name: "", contact: "" } });

  const sendCode = async (values: ContactValues) => {
    await new Promise((r) => setTimeout(r, 400));
    setSentTo(values);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentTo) return;
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Enter the 6-digit code.");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 400));
    const contact = sentTo.contact.trim();
    // Phone sign-ins get a placeholder email so bookings still have a stable owner.
    const email = channel === "email" ? contact : `${contact.replace(/\D/g, "").slice(-10)}@phone.clanb.in`;
    const user = signIn({ email, name: sentTo.name, phone: channel === "phone" ? contact : undefined });
    setVerifying(false);
    if (onSignedIn) onSignedIn(user);
    else router.push(safeNext(next));
  };

  if (sentTo) {
    return (
      <form onSubmit={verify} noValidate className={cn("space-y-4", className)}>
        <p className="text-sm text-mist">
          We sent a 6-digit code to <span className="font-medium text-white">{sentTo.contact}</span>.
        </p>
        <div>
          <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-white">
            Verification code
          </label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ""));
              setCodeError(null);
            }}
            error={codeError ?? undefined}
            className="font-mono tracking-[0.4em]"
          />
          <p className="mt-1.5 font-mono text-[11px] text-zinc-500">Demo mode: any 6 digits work.</p>
        </div>
        <Button type="submit" variant="primary" disabled={verifying} className="w-full">
          {verifying && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setSentTo(null);
            setCode("");
          }}
          className="w-full text-center text-xs text-mist hover:text-white"
        >
          Use a different {channel === "email" ? "email" : "number"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(sendCode)} noValidate className={cn("space-y-4", className)}>
      <div role="radiogroup" aria-label="Sign in with" className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {(["email", "phone"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={channel === c}
            onClick={() => setChannel(c)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium transition",
              channel === c ? "bg-signal text-ink" : "text-mist hover:text-white"
            )}
          >
            {c === "email" ? <Mail className="h-3.5 w-3.5" aria-hidden="true" /> : <Phone className="h-3.5 w-3.5" aria-hidden="true" />}
            {c === "email" ? "Email" : "Phone"}
          </button>
        ))}
      </div>

      {mode === "signup" && (
        <div>
          <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-white">
            Your name
          </label>
          <Input
            id="auth-name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", { required: "Tell us what to call you." })}
          />
        </div>
      )}

      <div>
        <label htmlFor="auth-contact" className="mb-1.5 block text-sm font-medium text-white">
          {channel === "email" ? "Email address" : "Mobile number"}
        </label>
        <Input
          key={channel}
          id="auth-contact"
          type={channel === "email" ? "email" : "tel"}
          autoComplete={channel === "email" ? "email" : "tel"}
          placeholder={channel === "email" ? "you@example.com" : "98765 43210"}
          error={errors.contact?.message}
          {...register("contact", {
            required: channel === "email" ? "Enter your email." : "Enter your mobile number.",
            validate: (v) =>
              channel === "email"
                ? EMAIL.test(v.trim()) || "Enter a valid email address."
                : PHONE.test(v.replace(/\s/g, "")) || "Enter a valid 10-digit Indian mobile number.",
          })}
        />
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Send code
      </Button>

      {!onSignedIn && (
        <p className="text-center text-xs text-mist">
          {mode === "login" ? "New to Clan B? " : "Already have an account? "}
          <Link
            href={`/${mode === "login" ? "signup" : "login"}${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-signal hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      )}
    </form>
  );
}
