import type { Metadata } from "next";

import { WeeklyGrid } from "@/components/weekly/weekly-grid";
import { config } from "@/lib/config";
import { getWeeklyIssuesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x Weekly | ${config.site.title}`,
  description: "The bilingual weekly archive for vw2x",
  keywords: `${config.site.title}, Weekly, journal`,
};

export default function WeeklyPage() {
  const issues = getWeeklyIssuesByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:py-8 md:pl-0 md:pr-0">
      <WeeklyGrid issues={issues} />
    </div>
  );
}
