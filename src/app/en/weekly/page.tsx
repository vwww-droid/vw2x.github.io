import type { Metadata } from "next";
import Link from "next/link";

import { WeeklyGrid } from "@/components/weekly/weekly-grid";
import { WeeklyShell } from "@/components/weekly/weekly-shell";
import { config } from "@/lib/config";
import { getLanguageSwitchTarget, getWeeklyIssuesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x Weekly | ${config.site.title}`,
  description: "The bilingual weekly archive for vw2x",
  keywords: `${config.site.title}, Weekly, journal`,
};

export default function WeeklyPage() {
  const locale = "en-US" as const;
  const issues = getWeeklyIssuesByLocale(locale);
  const languageSwitchTarget = getLanguageSwitchTarget("/en/weekly");

  return (
    <WeeklyShell
      locale={locale}
      languageSwitchHref={languageSwitchTarget.href}
      showHeader={false}
    >
      <section className="mb-4 flex flex-col gap-4 px-1 md:mb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-[14px] leading-none text-[rgba(36,41,47,0.76)]">
            vw2x
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.08] tracking-[-0.05em] text-[rgba(36,41,47,0.96)] md:text-[38px]">
            Weekly
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-[15px] text-[rgba(36,41,47,0.84)]">
          <Link
            href="/en/blog"
            className="transition-colors hover:text-[rgba(36,41,47,1)]"
          >
            Blog
          </Link>
          <Link
            href={config.social.github}
            className="transition-colors hover:text-[rgba(36,41,47,1)]"
          >
            GitHub
          </Link>
          <Link
            href={config.site.rss.feedLinks.rss2}
            className="transition-colors hover:text-[rgba(36,41,47,1)]"
          >
            RSS
          </Link>
          <Link
            href={languageSwitchTarget.href}
            className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-3 py-1 transition-colors hover:bg-white"
          >
            中
          </Link>
        </nav>
      </section>

      <WeeklyGrid issues={issues} />
    </WeeklyShell>
  );
}
