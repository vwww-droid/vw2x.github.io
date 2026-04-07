import { NoteCard } from "@/components/notes/note-card";
import type { Locale } from "@/lib/i18n";
import { buildNotesTimelineGroups, type NotesTimelineItem } from "@/lib/notes-timeline";
import { cn } from "@/lib/utils";

type NotesGridProps = {
  notes: NotesTimelineItem[];
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

  const timelineGroups = buildNotesTimelineGroups(notes);

  return (
    <div className="notes-timeline space-y-8 md:space-y-10">
      {timelineGroups.map((group) => (
        <section
          key={group.dateKey}
          className="grid grid-cols-1 gap-4 md:grid-cols-[88px_minmax(0,1fr)] md:gap-6"
        >
          <div className="notes-timeline-marker">
            <div className="notes-timeline-spine" aria-hidden="true" />
            <div className="notes-timeline-node">
              <span className="notes-timeline-month">{group.timelineLabel.monthShort}</span>
              <span className="notes-timeline-day">{group.timelineLabel.dayNumber}</span>
            </div>
          </div>

          <div
            className={cn(
              "notes-timeline-cards [&>*]:min-w-0",
              locale === "zh-CN" && "font-reading-zh"
            )}
          >
            {group.items.map((note) => (
              <NoteCard key={note.href} note={note} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
