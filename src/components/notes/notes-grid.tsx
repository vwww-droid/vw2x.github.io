import { NoteCard, type NoteTeaser } from "@/components/notes/note-card";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NotesGridProps = {
  notes: NoteTeaser[];
  locale: Locale;
};

export function NotesGrid({ notes, locale }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div
        className={cn(
          "rounded-[24px] border border-[rgba(36,41,47,0.08)] bg-[rgba(255,255,255,0.72)] px-5 py-8 text-[15px] leading-[1.8] text-[rgba(85,85,85,0.84)]",
          locale === "zh-CN" && "font-reading-zh"
        )}
      >
        {locale === "en-US"
          ? "No notes yet. This space will fill up as quick captures are added."
          : "还没有笔记。等有新的随手记录，这里会慢慢填满。"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard key={note.href} note={note} />
      ))}
    </div>
  );
}
