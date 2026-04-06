import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "@/lib/config"
import type { Locale } from "@/lib/i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? config.site.url
  return `${base}${path}`
}

export function formatDate(date: string) {
  const [year, month, day] = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).split('/');
  return `${year}年${month}月${day}日`;
}

export function formatDateCompact(
  date: string,
  locale: Locale = "zh-CN"
) {
  const parsed = new Date(date);

  if (locale === "en-US") {
    return parsed.toISOString().slice(0, 10);
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}
