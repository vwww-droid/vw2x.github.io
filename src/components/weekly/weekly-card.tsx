import Link from "next/link";

import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";
import { cn, formatDateWeekly } from "@/lib/utils";

export type WeeklyTeaser = {
  href: string;
  title: string;
  date: string;
  summary?: string;
  cover: BlogCover;
  issue: number;
  issueLabel?: string;
  lang?: Locale;
};

type WeeklyCardProps = {
  issue: WeeklyTeaser;
  priority?: boolean;
};

function getWeeklyIssueLabel(issue: WeeklyTeaser, locale: Locale) {
  return issue.issueLabel ?? (locale === "en-US" ? `Issue ${issue.issue}` : `第 ${issue.issue} 期`);
}

export function WeeklyCard({ issue, priority = false }: WeeklyCardProps) {
  const issueLocale = issue.lang ?? (issue.href.startsWith("/en/") ? "en-US" : "zh-CN");

  return (
    <article className="h-full min-w-0">
      <Link
        href={issue.href}
        className={cn(
          "group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.82)] shadow-[0_18px_42px_rgba(36,41,47,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(36,41,47,0.08)]",
          issueLocale === "zh-CN" && "font-reading-zh"
        )}
      >
        <BlogCoverImage
          cover={issue.cover}
          priority={priority}
          sizes="(min-width: 1536px) 320px, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[1.28] w-full bg-[rgba(246,241,232,0.92)]"
          imageClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="flex flex-1 flex-col gap-2 px-4 py-4 md:px-4 md:py-4">
          <div className="flex items-center justify-between gap-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(85,85,85,0.72)]">
            <span>{getWeeklyIssueLabel(issue, issueLocale)}</span>
            <span>{formatDateWeekly(issue.date)}</span>
          </div>
          <h2 className="line-clamp-2 text-[20px] leading-[1.35] font-semibold tracking-[-0.03em] text-[rgba(36,41,47,0.95)] md:text-[18px]">
            {issue.title}
          </h2>
          <p className="line-clamp-2 min-h-[3.1em] text-[15px] leading-[1.65] text-[rgba(85,85,85,0.86)] md:text-[14px]">
            {issue.summary ?? ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
