"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, getOppositeLocale } from "@/lib/i18n";

export function LanguageSwitch() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const nextLocale = getOppositeLocale(locale);
  const label = nextLocale === "en-US" ? "En" : "中";
  const targetHref = buildLocaleRedirect(nextLocale, pathname);

  return (
    <Link
      href={targetHref}
      className="text-[16px] font-bold text-[rgba(36,41,47,0.82)] transition-colors hover:text-[#24292f]"
    >
      {label}
    </Link>
  );
}

function buildLocaleRedirect(locale: "zh-CN" | "en-US", current: string) {
  return `/set-locale?locale=${encodeURIComponent(locale)}&current=${encodeURIComponent(current)}`;
}
