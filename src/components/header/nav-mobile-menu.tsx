"use client";

import * as React from "react";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "./nav-data";

export function NavMobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <nav
      aria-label="Primary"
      className="flex h-14 items-center justify-between md:hidden md:h-[84px]"
    >
      <Link
        href="/"
        className="text-[24px] font-extrabold tracking-[-0.03em] text-[#24292f] transition-colors hover:opacity-80"
      >
        vw2x
      </Link>
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
    </nav>
  );
}
