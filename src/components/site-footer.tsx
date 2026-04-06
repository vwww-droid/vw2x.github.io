"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/lib/config";

function Separator() {
  return <span className="text-muted-foreground/50" aria-hidden>·</span>;
}

export function SiteFooter() {
  const pathname = usePathname();
  const github = config.social.github;
  const isWeeklyDetail =
    pathname.startsWith("/weekly/") || pathname.startsWith("/en/weekly/");

  if (isWeeklyDetail) {
    return null;
  }

  return (
    <footer className="shrink-0 border-t border-black/5">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-[clamp(0.75rem,3.5vw,1.25rem)] py-6 text-sm text-muted-foreground/80 md:py-7">
        <Link href="/about" className="transition-colors hover:text-foreground">
          关于我
        </Link>
        <Separator />
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Github
        </a>
      </div>
    </footer>
  );
}
