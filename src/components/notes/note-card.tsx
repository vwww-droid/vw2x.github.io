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
    <article className="min-w-0">
      <Link
        href={note.href}
        className={cn(
          "group block rounded-[20px] border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.82)] px-4 py-4 shadow-[0_10px_26px_rgba(36,41,47,0.05)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[rgba(36,41,47,0.14)] hover:shadow-[0_16px_32px_rgba(36,41,47,0.08)]",
          locale === "zh-CN" && "font-reading-zh"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[18px] font-semibold leading-[1.35] tracking-[-0.03em] text-[rgba(36,41,47,0.96)]">
              {note.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-[14px] leading-[1.7] text-[rgba(85,85,85,0.84)]">
              {note.summary ?? ""}
            </p>
          </div>
          <span className="shrink-0 text-[12px] uppercase tracking-[0.14em] text-[rgba(85,85,85,0.62)]">
            {formatDateCompact(note.date, locale)}
          </span>
        </div>
      </Link>
    </article>
  );
}
