import Link from "next/link";
import type { ReactNode } from "react";

import { config } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type WeeklyShellProps = {
  locale: Locale;
  languageSwitchHref: string;
  children: ReactNode;
  className?: string;
};

function getBlogHref(locale: Locale) {
  return locale === "en-US" ? "/en/blog" : "/blog";
}

function getWeeklyHref(locale: Locale) {
  return locale === "en-US" ? "/en/weekly" : "/weekly";
}

function getRssHref() {
  return config.site.rss.feedLinks.rss2;
}

export function WeeklyShell({
  locale,
  languageSwitchHref,
  children,
  className,
}: WeeklyShellProps) {
  return (
    <main className="weekly-page-bg relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0)_34%),radial-gradient(circle_at_84%_8%,rgba(199,186,164,0.2)_0%,rgba(199,186,164,0)_26%),linear-gradient(180deg,rgba(232,224,213,0.8)_0%,rgba(239,237,230,0.5)_38%,rgba(232,232,232,0.1)_100%)]"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-4 py-4 md:px-5 md:py-5">
        <header className="weekly-surface relative z-10 rounded-[26px] border border-[rgba(255,255,255,0.72)] px-4 py-4 backdrop-blur-md md:px-5 md:py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={getWeeklyHref(locale)}
                className={cn(
                  "inline-flex items-center gap-2 text-[20px] font-semibold tracking-[-0.04em] text-[rgba(36,41,47,0.96)] md:text-[22px]",
                  locale === "zh-CN" && "font-reading-zh"
                )}
              >
                <span className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.76)] px-3 py-1 text-[14px] leading-none text-[rgba(36,41,47,0.76)]">
                  vw2x
                </span>
                <span>周记</span>
              </Link>
              <span className="hidden h-5 w-px bg-[rgba(36,41,47,0.12)] lg:block" />
              <p className="text-[13px] leading-relaxed text-[rgba(85,85,85,0.8)]">
                {locale === "en-US"
                  ? "A bilingual weekly journal for vw2x."
                  : "vw2x 的双语周记，记录每周真正留下来的东西。"}
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-[14px] text-[rgba(36,41,47,0.82)]">
              <Link
                href={getBlogHref(locale)}
                className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.68)] px-3 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.92)]"
              >
                Blog
              </Link>
              <Link
                href={config.social.github}
                className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.68)] px-3 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.92)]"
              >
                GitHub
              </Link>
              <Link
                href={getRssHref()}
                className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.68)] px-3 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.92)]"
              >
                RSS
              </Link>
              <Link
                href={languageSwitchHref}
                className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(36,41,47,0.9)] px-3 py-1.5 text-white transition-colors hover:bg-[rgba(36,41,47,1)]"
              >
                {locale === "en-US" ? "中" : "En"}
              </Link>
            </nav>
          </div>
        </header>

        <div className={cn("relative flex-1 py-4 md:py-5", className)}>{children}</div>
      </div>
    </main>
  );
}
