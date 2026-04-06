import * as React from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import { components } from "@/components/mdx-components";
import { SearchTrigger } from "@/components/search/search-trigger";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";
import { WeeklyShell } from "@/components/weekly/weekly-shell";
import { cn } from "@/lib/utils";
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

const weeklyComponents = {
  ...components,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "!mb-[13px] !mt-[28px] !text-[32px] !leading-[1.7] font-bold tracking-[0.8px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "!mb-[13px] !mt-[28px] !text-[24px] !leading-[1.7] font-bold tracking-[0.8px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "!mb-[13px] !mt-[10px] !text-[20px] !leading-[1.7] font-bold tracking-[0.8px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "!mb-[13px] !mt-[10px] !text-[16px] !leading-[1.7] font-bold tracking-[0.5px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "!mb-[13px] !mt-[10px] !text-[16px] !leading-[1.7] font-bold tracking-[0.5px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "!mb-[13px] !mt-[10px] !text-[16px] !leading-[1.7] font-bold tracking-[0.5px] text-[rgba(36,41,47,0.96)]",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "!my-[28px] !text-[16px] !leading-[1.7] tracking-[0.5px] text-[rgba(36,41,47,0.92)]",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "!my-[28px] list-disc pl-5 !text-[16px] !leading-[1.7] tracking-[0.5px] text-[rgba(36,41,47,0.92)] [&>li+li]:mt-3",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "!my-[28px] list-decimal pl-7 !text-[16px] !leading-[1.7] tracking-[0.5px] text-[rgba(36,41,47,0.92)] [&>li+li]:mt-3",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "!my-[28px] border-l-4 border-[#c9ced4] pl-3 !text-[16px] !leading-[1.7] tracking-[0.5px] text-[rgba(36,41,47,0.82)]",
        className
      )}
      {...props}
    />
  ),
};

function getSidebarTitle(title: string) {
  return title.replace(/^(\d+)\s*-\s*/, "$1 ");
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
    <nav className="space-y-1.5 text-[17px] leading-[1.5] text-[rgba(36,41,47,0.92)]">
      {issues.map((issue) => {
        const active = issue.href === activeHref;

        return (
          <Link
            key={issue.href}
            href={issue.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "block truncate px-[11px] py-[5px] transition-colors hover:text-[#a67c52]",
              active && "font-semibold text-[#a67c52]",
              locale === "zh-CN" && "font-reading-zh"
            )}
          >
            {getSidebarTitle(issue.title)}
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
    <WeeklyShell>
      <main className="min-h-screen bg-white">
        <div className="mx-auto grid min-h-screen w-full max-w-[1338px] grid-cols-1 px-2 md:px-0 lg:grid-cols-[288px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:pl-8 lg:pr-8 lg:pt-8">
          <div className="flex h-full flex-col">
            <div className="weekly-scrollbar flex-1 overflow-y-auto pr-2">
              <WeeklyIssueList issues={issues} activeHref={issue.href} locale={locale} />
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-2 pb-16 pt-5 md:px-4 md:pt-6 lg:px-8">
          <article className="mx-auto w-full max-w-[998px]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h1
                className={cn(
                  "flex-1 text-[24px] font-extrabold leading-[1.12] tracking-[0.18px] text-[rgba(36,41,47,0.96)] md:text-[32px] md:leading-[1.14] xl:text-[36px]",
                  locale === "zh-CN" && "font-reading-zh"
                )}
              >
                <span>{getSidebarTitle(issue.title)}</span>
              </h1>
              <div className="flex shrink-0 items-center gap-2 pt-1">
                <SearchTrigger className="bg-[rgba(245,245,245,0.95)] hover:bg-[rgba(235,235,235,0.95)]" />
                <Link
                  href={languageSwitchHref}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,245,245,0.95)] text-sm font-medium text-[rgba(85,85,85,0.86)] transition-colors hover:bg-[rgba(235,235,235,0.95)] hover:text-[rgba(36,41,47,1)]"
                >
                  {locale === "en-US" ? "中" : "En"}
                </Link>
              </div>
            </div>
            <BlogCoverImage
              cover={issue.cover as BlogCover}
              priority
              sizes="(min-width: 1152px) 998px, 100vw"
              className="aspect-[1.58] w-full rounded-[14px] bg-[rgba(246,241,232,0.92)]"
              imageClassName="object-cover transition-none"
            />
            {issue.summary ? (
              <p
                className={cn(
                  "mt-7 text-[16px] leading-[1.7] tracking-[0.5px] text-[rgba(36,41,47,0.92)]",
                  locale === "zh-CN" && "font-reading-zh"
                )}
              >
                {issue.summary}
              </p>
            ) : null}
            <div
              className={cn(
                "weekly-article mt-8",
                locale === "zh-CN" && "font-reading-zh"
              )}
            >
              <MDXRemote
                source={expandMultiBlankLines(issue.content)}
                components={weeklyComponents}
                options={options}
              />
            </div>
          </article>
        </section>
        </div>
      </main>
    </WeeklyShell>
  );
}
