import type { Metadata } from "next";

import { WeeklyGrid } from "@/components/weekly/weekly-grid";
import { WeeklyShell } from "@/components/weekly/weekly-shell";
import { config } from "@/lib/config";
import { getLanguageSwitchTarget, getWeeklyIssuesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 周记 | ${config.site.title}`,
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
    >
      <section className="mb-5 weekly-surface rounded-[28px] border border-[rgba(255,255,255,0.72)] px-4 py-5 md:px-6 md:py-6">
        <p className="text-[12px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.72)]">
          Weekly archive
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[30px] font-semibold leading-[1.14] tracking-[-0.04em] text-[rgba(36,41,47,0.96)] md:text-[42px]">
              vw2x 周记
            </h1>
            <p className="mt-3 max-w-[48rem] text-[16px] leading-[1.8] text-[rgba(85,85,85,0.84)]">
              A bilingual issue archive built around a cover-first scan, then a slower reading flow once you open an issue.
            </p>
          </div>
          <div className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-[14px] text-[rgba(85,85,85,0.8)]">
            {issues.length} issues
          </div>
        </div>
      </section>

      <WeeklyGrid issues={issues} />
    </WeeklyShell>
  );
}
