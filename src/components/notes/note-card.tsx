import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type NoteCardTeaser = {
  href: string;
  title: string;
  summary?: string | null;
  lang?: Locale;
};

type NoteCardProps = {
  note: NoteCardTeaser;
};

export function NoteCard({ note }: NoteCardProps) {
  const locale = note.lang ?? (note.href.startsWith("/en/") ? "en-US" : "zh-CN");

  return (
    <article className="h-full min-w-0">
      <Link
        href={note.href}
        className={cn(
          "card-content flex h-full min-h-[172px] flex-col rounded-[22px] bg-white/92 px-4 py-4 shadow-md transition-transform duration-200 hover:-translate-y-0.5 sm:aspect-square",
          locale === "zh-CN" && "font-reading-zh"
        )}
      >
        <div className="flex h-full flex-col">
          <h2 className="line-clamp-3 text-[18px] font-semibold leading-[1.35] tracking-[-0.03em] text-[rgba(36,41,47,0.96)] md:text-[16px]">
            {note.title}
          </h2>
          <p className="mt-auto line-clamp-3 pt-4 text-[15px] leading-[1.65] text-[rgba(85,85,85,0.84)] md:text-[14px]">
            {note.summary ?? ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
