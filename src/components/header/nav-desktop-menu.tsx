import Link from "next/link";

import { navItems } from "./nav-data";

export function NavDesktopMenu() {
  return (
    <nav
      aria-label="Primary"
      className="hidden h-14 items-center justify-between md:flex md:h-[84px]"
    >
      <Link
        href="/"
        className="text-[24px] font-extrabold tracking-[-0.03em] text-[#24292f] transition-colors hover:opacity-80 md:text-[30px]"
      >
        vw2x
      </Link>
      <div className="flex items-center gap-8 text-[16px] font-bold text-[rgba(36,41,47,0.82)]">
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
      </div>
    </nav>
  );
}
