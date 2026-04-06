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
        className="text-base font-medium tracking-[-0.03em] transition-colors hover:opacity-70"
      >
        vw2x
      </Link>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        {navItems.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
