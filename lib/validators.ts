export const EMAIL_PATTERN = { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." };
export const PHONE_PATTERN = {
  value: /^(\+91[\s-]?)?[6-9]\d{9}$/,
  message: "Enter a valid 10-digit Indian mobile number.",
};

export function requireOne(message: string) {
  return (value: string[]) => value.length > 0 || message;
}

/** Normalises a login identifier: e-mails lower-cased, phones reduced to +91XXXXXXXXXX. */
export function normaliseIdentifier(channel: "phone" | "email", raw: string): string | null {
  const value = raw.trim();
  if (channel === "email") {
    return EMAIL_PATTERN.value.test(value) ? value.toLowerCase() : null;
  }
  const compact = value.replace(/[\s-]/g, "");
  if (!PHONE_PATTERN.value.test(compact)) return null;
  return `+91${compact.slice(-10)}`;
}
