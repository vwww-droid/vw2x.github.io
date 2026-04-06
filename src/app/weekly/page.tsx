import type { Metadata } from "next";

import { WeeklyGrid } from "@/components/weekly/weekly-grid";
import { config } from "@/lib/config";
import { getWeeklyIssuesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 周记 | ${config.site.title}`,
  description: "vw2x 的双语周记归档",
  keywords: `${config.site.title}, 周记, Weekly`,
};

export default function WeeklyPage() {
  const issues = getWeeklyIssuesByLocale("zh-CN");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:py-8 md:pl-0 md:pr-0">
      <WeeklyGrid issues={issues} />
    </div>
  );
}
