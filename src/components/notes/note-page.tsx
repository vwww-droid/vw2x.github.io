import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { components } from "@/components/mdx-components";
import type { Locale } from "@/lib/i18n";
import { cn, formatDateCompact } from "@/lib/utils";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";

type NotePageProps = {
  locale: Locale;
  languageSwitchHref: string;
  note: {
    title: string;
    date: string;
    summary?: string | null;
    content: string;
  };
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

export function NotePage({ locale, languageSwitchHref, note }: NotePageProps) {
  return (
    <main className="mx-auto w-full max-w-[760px] px-4 py-6 md:px-6 md:py-10">
      <div className="mb-4 flex items-center justify-end gap-3 text-[14px] text-[rgba(85,85,85,0.82)]">
        <Link
          href={locale === "en-US" ? "/en/notes" : "/notes"}
          className="transition-colors hover:text-[rgba(36,41,47,0.96)]"
        >
          {locale === "en-US" ? "Notes" : "笔记"}
        </Link>
        <Link
          href={languageSwitchHref}
          className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-3 py-1 transition-colors hover:bg-white"
        >
          {locale === "en-US" ? "中" : "En"}
        </Link>
      </div>
      <article className="rounded-[28px] border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.88)] px-5 py-6 shadow-[0_14px_38px_rgba(36,41,47,0.05)] md:px-8 md:py-8">
        <header className={cn(locale === "zh-CN" && "font-reading-zh")}>
          <p className="text-[12px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.68)]">
            {formatDateCompact(note.date, locale)}
          </p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-[-0.04em] text-[rgba(36,41,47,0.96)] md:text-[40px]">
            {note.title}
          </h1>
          {note.summary ? (
            <p className="mt-4 text-[16px] leading-[1.72] text-[rgba(36,41,47,0.88)] md:text-[18px]">
              {note.summary}
            </p>
          ) : null}
        </header>

        <div
          className={cn(
            "mdx-content mt-7 [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2",
            locale === "zh-CN" && "font-reading-zh"
          )}
        >
          <MDXRemote
            source={expandMultiBlankLines(note.content)}
            components={components}
            options={options}
          />
        </div>
      </article>
    </main>
  );
}
