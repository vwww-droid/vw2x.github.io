"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchTrigger } from "@/components/search/search-trigger";
import { config } from "@/lib/config";
import { getLocaleFromPathname } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { getNavItems } from "./nav-data";

export function NavDesktopMenu() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const homeHref = locale === "en-US" ? "/en" : "/";
  const navItems = getNavItems(locale);

  return (
    <nav
      aria-label="Primary"
      className="hidden items-start justify-between gap-8 py-3 md:flex md:py-4"
    >
      <div className="min-w-0 flex-1">
        <Link
          href={homeHref}
          className="block text-[24px] font-extrabold tracking-[-0.03em] text-[#24292f] transition-colors hover:opacity-80 md:text-[30px]"
        >
          vw2x
        </Link>
        <p className="mt-0.5 text-[12px] leading-[1.25] text-[rgba(85,85,85,0.78)] md:text-[13px]">
          {config.site.tagline}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-8 pt-1 text-[16px] font-bold text-[rgba(36,41,47,0.82)]">
        {navItems.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#24292f]"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[#24292f]"
            >
              {item.label}
            </Link>
          )
        )}
        <SearchTrigger />
        <LanguageSwitch />
      </div>
    </nav>
  );
}
