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
    >
      <section className="mb-5 weekly-surface rounded-[28px] border border-[rgba(255,255,255,0.72)] px-4 py-5 md:px-6 md:py-6">
        <p className="text-[12px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.72)]">
          周记归档
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[30px] font-semibold leading-[1.14] tracking-[-0.04em] text-[rgba(36,41,47,0.96)] md:text-[42px] font-reading-zh">
              vw2x 周记
            </h1>
            <p className="mt-3 max-w-[48rem] text-[16px] leading-[1.8] text-[rgba(85,85,85,0.84)] font-reading-zh">
              这里放的是按期整理后的周记条目，先用封面和标题把记忆挂住，再把这一周真正留下来的变化写清楚。
            </p>
          </div>
          <div className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-[14px] text-[rgba(85,85,85,0.8)]">
            {issueCountLabel}
          </div>
        </div>
      </section>

      <WeeklyGrid issues={issues} />
    </WeeklyShell>
  );
}
