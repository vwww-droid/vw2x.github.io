"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchTrigger } from "@/components/search/search-trigger";
import { config } from "@/lib/config";
import { getLocaleFromPathname } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { getNavItems } from "./nav-data";

export function NavMobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const homeHref = locale === "en-US" ? "/en" : "/";
  const navItems = getNavItems(locale);

  return (
    <nav
      aria-label="Primary"
      className="flex items-start justify-between gap-3 py-3 md:hidden"
    >
      <div className="min-w-0 flex-1 pr-2">
        <Link
          href={homeHref}
          className="block text-[24px] font-extrabold tracking-[-0.03em] text-[#24292f] transition-colors hover:opacity-80"
        >
          vw2x
        </Link>
        <p className="mt-0.5 text-[12px] leading-[1.25] text-[rgba(85,85,85,0.78)]">
          {config.site.tagline}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <SearchTrigger />
        <LanguageSwitch />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="text-[15px] font-bold text-[rgba(36,41,47,0.82)] transition-colors hover:text-[#24292f]"
            >
              Menu
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(18rem,85vw)]">
            <SheetTitle className="sr-only">Primary navigation</SheetTitle>
            <div className="flex h-full flex-col justify-between px-6 py-8">
              <div className="space-y-8">
                <div className="text-[24px] font-extrabold tracking-[-0.03em] text-[#24292f]">vw2x</div>
                <div className="flex flex-col gap-5 text-[18px] font-bold text-[rgba(36,41,47,0.82)]">
                  {navItems.map((item) =>
                    item.external ? (
                      <SheetClose asChild key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[#24292f]"
                        >
                          {item.label}
                        </a>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-[#24292f]"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    )
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
