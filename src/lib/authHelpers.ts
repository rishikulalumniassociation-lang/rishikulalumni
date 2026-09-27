import crypto from "crypto";

export function formatToE164(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return digits.length >= 10 ? `+91${digits.slice(-10)}` : `+${digits}`;
}

export function getCleanDigits(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}


export function hashSha256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}
