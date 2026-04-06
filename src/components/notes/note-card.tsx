import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { cn, formatDateCompact } from "@/lib/utils";

export type NoteTeaser = {
  href: string;
  title: string;
  date: string;
  summary?: string | null;
  lang?: Locale;
};

type NoteCardProps = {
  note: NoteTeaser;
};

export function NoteCard({ note }: NoteCardProps) {
  const locale = note.lang ?? (note.href.startsWith("/en/") ? "en-US" : "zh-CN");

  return (
    <article className="h-full min-w-0">
      <Link
        href={note.href}
        className={cn(
          "card-content flex h-full flex-col rounded-lg bg-white px-4 py-4 shadow-md",
          locale === "zh-CN" && "font-reading-zh"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[18px] font-semibold leading-[1.35] tracking-[-0.03em] text-[rgba(36,41,47,0.96)] md:text-[16px]">
              {note.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-[rgba(85,85,85,0.84)] md:text-[14px]">
              {note.summary ?? ""}
            </p>
          </div>
          <span className="shrink-0 text-[12px] uppercase tracking-[0.12em] text-[rgba(85,85,85,0.62)]">
            {formatDateCompact(note.date, locale)}
          </span>
        </div>
      </Link>
    </article>
  );
}
