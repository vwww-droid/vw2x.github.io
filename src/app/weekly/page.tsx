import type { Metadata } from "next";

import { WeeklyGrid } from "@/components/weekly/weekly-grid";
import { WeeklyShell } from "@/components/weekly/weekly-shell";
import { config } from "@/lib/config";
import { getWeeklyIssuesByLocale } from "@/lib/content";
import { getLanguageSwitchTarget } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 周记 | ${config.site.title}`,
  description: "vw2x 的双语周记归档",
  keywords: `${config.site.title}, 周记, Weekly`,
};

export default function WeeklyPage() {
  const locale = "zh-CN" as const;
  const issues = getWeeklyIssuesByLocale(locale);
  const languageSwitchTarget = getLanguageSwitchTarget("/weekly");
  const issueCountLabel = `${issues.length} 期`;

  return (
    <WeeklyShell
      locale={locale}
      languageSwitchHref={languageSwitchTarget.href}
      showHeader={false}
    >
      <section className="mb-4 flex flex-col gap-3 px-1 md:mb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(85,85,85,0.62)]">
            Weekly
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-[1.08] tracking-[-0.05em] text-[rgba(36,41,47,0.96)] md:text-[38px] font-reading-zh">
            vw2x 周记
          </h1>
        </div>
        <div className="text-[13px] text-[rgba(85,85,85,0.72)]">{issueCountLabel}</div>
      </section>

      <WeeklyGrid issues={issues} />
    </WeeklyShell>
  );
}
