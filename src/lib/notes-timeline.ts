import type { Locale } from "@/lib/i18n";

export type NotesTimelineItem = {
  href: string;
  title: string;
  date: string;
  summary?: string | null;
  lang?: Locale;
};

export type NotesTimelineGroup = {
  dateKey: string;
  timelineLabel: {
    monthShort: string;
    dayNumber: string;
  };
  items: Array<{
    href: string;
    title: string;
    summary: string;
    date: string;
    lang?: Locale;
  }>;
};

// Expects a zero-padded yyyy-MM-dd date string.
function formatTimelineLabel(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" }).format(parsed);
  const dayNumber = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(parsed);

  return { monthShort, dayNumber };
}

export function buildNotesTimelineGroups(
  notes: NotesTimelineItem[]
): NotesTimelineGroup[] {
  const groups = new Map<string, NotesTimelineGroup>();

  for (const note of notes) {
    const dateKey = note.date;
    const existing = groups.get(dateKey);
    const item = {
      href: note.href,
      title: note.title,
      summary: note.summary ?? "",
      date: note.date,
      lang: note.lang,
    };

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(dateKey, {
      dateKey,
      timelineLabel: formatTimelineLabel(dateKey),
      items: [item],
    });
  }

  return [...groups.values()].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
