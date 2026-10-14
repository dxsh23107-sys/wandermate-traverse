import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `WT-${year}-${randomNum}`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanedPhone = (phone || "8779884225").replace(/[^0-9]/g, "");
  const countryPhone = cleanedPhone.startsWith("91") && cleanedPhone.length > 10 ? cleanedPhone : `91${cleanedPhone}`;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${countryPhone}?text=${encodedText}`;
}

export function parseJsonSafe<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
