import type { Metadata } from "next";
import Link from "next/link";

import { NotesGrid } from "@/components/notes/notes-grid";
import { config } from "@/lib/config";
import { getLanguageSwitchTarget, getNotesByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 笔记 | ${config.site.title}`,
  description: "vw2x 的双语笔记归档",
  keywords: `${config.site.title}, 笔记, Notes`,
};

export default function NotesPage() {
  const locale = "zh-CN" as const;
  const notes = getNotesByLocale(locale);
  const languageSwitchTarget = getLanguageSwitchTarget("/notes");

  return (
    <main className="mx-auto w-full max-w-[920px] px-4 py-4 md:px-6 md:py-8">
      <section className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-[14px] leading-none text-[rgba(36,41,47,0.76)]">
            vw2x
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.08] tracking-[-0.05em] text-[rgba(36,41,47,0.96)] md:text-[38px] font-reading-zh">
            笔记
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-[15px] text-[rgba(36,41,47,0.84)]">
          <Link href="/blog" className="transition-colors hover:text-[rgba(36,41,47,1)]">
            Blog
          </Link>
          <Link href={config.social.github} className="transition-colors hover:text-[rgba(36,41,47,1)]">
            GitHub
          </Link>
          <Link href={config.site.rss.feedLinks.rss2} className="transition-colors hover:text-[rgba(36,41,47,1)]">
            RSS
          </Link>
          <Link
            href={languageSwitchTarget.href}
            className="rounded-full border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-3 py-1 transition-colors hover:bg-white"
          >
            En
          </Link>
        </nav>
      </section>

      <NotesGrid notes={notes} locale={locale} />
    </main>
  );
}
