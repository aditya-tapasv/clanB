export const EMAIL_PATTERN = { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." };
export const PHONE_PATTERN = {
  value: /^(\+91[\s-]?)?[6-9]\d{9}$/,
  message: "Enter a valid 10-digit Indian mobile number.",
};

export function requireOne(message: string) {
  return (value: string[]) => value.length > 0 || message;
}
