import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import count from "word-count";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import { components } from "@/components/mdx-components";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";
import { cn, formatDateCompact } from "@/lib/utils";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";
import { WeeklyShell } from "@/components/weekly/weekly-shell";
import type { WeeklyTeaser } from "@/components/weekly/weekly-card";

type WeeklyIssuePageProps = {
  locale: Locale;
  languageSwitchHref: string;
  issue: WeeklyTeaser & {
    content: string;
    updated?: string | null;
  };
  issues: WeeklyTeaser[];
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

function getIssueLabel(issue: WeeklyTeaser, locale: Locale) {
  return issue.issueLabel ?? (locale === "en-US" ? `Issue ${issue.issue}` : `第 ${issue.issue} 期`);
}

function getCountLabel(content: string, locale: Locale) {
  if (locale === "en-US") {
    return `${count(content)} words`;
  }

  return `${content.replace(/\s+/g, "").length} 字`;
}

function WeeklyIssueList({
  issues,
  activeHref,
  locale,
}: {
  issues: WeeklyTeaser[];
  activeHref: string;
  locale: Locale;
}) {
  return (
    <nav className="space-y-2">
      {issues.map((issue) => {
        const active = issue.href === activeHref;

        return (
          <Link
            key={issue.href}
            href={issue.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "block rounded-[18px] border px-3 py-3 transition-colors",
              active
                ? "border-[rgba(36,41,47,0.18)] bg-[rgba(36,41,47,0.94)] text-white shadow-[0_14px_28px_rgba(36,41,47,0.14)]"
                : "border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.66)] text-[rgba(36,41,47,0.9)] hover:bg-[rgba(255,255,255,0.9)]",
              locale === "zh-CN" && "font-reading-zh"
            )}
          >
            <div className="flex items-center justify-between gap-3 text-[12px] uppercase tracking-[0.14em] opacity-80">
              <span>{getIssueLabel(issue, locale)}</span>
              <span>{formatDateCompact(issue.date, locale)}</span>
            </div>
            <div className="mt-2 line-clamp-2 text-[15px] leading-[1.55] font-semibold tracking-[-0.02em]">
              {issue.title}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

export function WeeklyIssuePage({
  locale,
  languageSwitchHref,
  issue,
  issues,
}: WeeklyIssuePageProps) {
  return (
    <WeeklyShell locale={locale} languageSwitchHref={languageSwitchHref}>
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">
        <aside className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
          <div className="weekly-surface rounded-[26px] border border-[rgba(255,255,255,0.72)] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.72)]">
                  {locale === "en-US" ? "Issue list" : "期刊列表"}
                </p>
                <h2
                  className={cn(
                    "mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[rgba(36,41,47,0.95)]",
                    locale === "zh-CN" && "font-reading-zh"
                  )}
                >
                  {locale === "en-US" ? "Archive" : "归档"}
                </h2>
              </div>
              <div className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.7)] px-3 py-1 text-[12px] text-[rgba(85,85,85,0.8)]">
                {issues.length}
              </div>
            </div>
            <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-1 weekly-scrollbar">
              <WeeklyIssueList issues={issues} activeHref={issue.href} locale={locale} />
            </div>
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <article className="weekly-surface rounded-[28px] border border-[rgba(255,255,255,0.72)] px-4 py-5 md:px-6 md:py-6">
            <div className="px-1">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.72)]">
                {formatDateCompact(issue.date, locale)} · {getIssueLabel(issue, locale)} ·{" "}
                {getCountLabel(issue.content, locale)}
              </p>
              <h1
                className={cn(
                  "mt-3 text-[30px] font-semibold leading-[1.14] tracking-[-0.04em] text-[rgba(36,41,47,0.96)] md:text-[42px]",
                  locale === "zh-CN" && "font-reading-zh"
                )}
              >
                {issue.title}
              </h1>
              {issue.summary ? (
                <p
                  className={cn(
                    "mt-4 max-w-[50rem] text-[16px] leading-[1.85] text-[rgba(85,85,85,0.85)] md:text-[18px]",
                    locale === "zh-CN" && "font-reading-zh"
                  )}
                >
                  {issue.summary}
                </p>
              ) : null}
            </div>
            <BlogCoverImage
              cover={issue.cover as BlogCover}
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="mt-5 aspect-[1.58] w-full rounded-[22px] bg-[rgba(246,241,232,0.92)]"
              imageClassName="object-cover transition-none"
            />
          </article>

          <article className="mt-4 weekly-surface rounded-[28px] border border-[rgba(255,255,255,0.72)] px-4 py-5 md:px-8 md:py-8">
            <div
              className={cn(
                "mdx-content [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2",
                locale === "zh-CN" && "font-reading-zh"
              )}
            >
              <MDXRemote
                source={expandMultiBlankLines(issue.content)}
                components={components}
                options={options}
              />
            </div>
          </article>
        </section>
      </div>
    </WeeklyShell>
  );
}
