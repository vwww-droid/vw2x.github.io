# Notes Timeline Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual `notes` index into a day-grouped timeline wall with near-square cards, title-first content, and a persistent left-side date spine.

**Architecture:** Keep the route and content source unchanged, and introduce one small grouping helper that derives daily sections from the existing note list. Rework the `NotesGrid` and `NoteCard` presentation around that grouped shape, add only the CSS utilities needed for the new timeline rhythm, and verify the result with pure data tests plus existing route wiring checks.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Node test runner

---

## File Structure

### Data shaping and tests

- Create: `src/lib/notes-timeline.ts`
  Derive archive-style day labels and day-grouped note sections from the existing notes list.
- Create: `scripts/tests/notes-timeline.test.mts`
  Lock the grouping shape, reverse chronological ordering, and summary fallback behavior.
- Create: `scripts/tests/notes-grid-component.test.mts`
  Lock the redesigned notes list and card structure at the source level, since the repository does not currently have a JSX rendering test harness.
- Modify: `scripts/tests/notes-index-page.test.mts`
  Keep the route wiring check and add assertions that the index still renders through the notes-specific list component after the redesign.

### Notes index UI

- Modify: `src/components/notes/notes-grid.tsx`
  Replace the flat grid with grouped timeline sections while preserving the current empty state handling.
- Modify: `src/components/notes/note-card.tsx`
  Change the card from metadata-heavy wide cards to near-square title-and-summary cards that fit the grouped layout.
- Modify: `src/app/notes/page.tsx`
  Widen the page shell to support denser desktop rows.
- Modify: `src/app/en/notes/page.tsx`
  Mirror the Chinese page shell changes.
- Modify: `src/app/globals.css`
  Add minimal timeline-specific utilities for the notes index without touching the note detail page.

## Task 1: Add a Day-Grouping Helper for the Notes Index

**Files:**
- Create: `src/lib/notes-timeline.ts`
- Create: `scripts/tests/notes-timeline.test.mts`

- [ ] **Step 1: Write the failing grouping test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { buildNotesTimelineGroups } from "../../src/lib/notes-timeline.ts";

const zhNotes = [
  {
    href: "/notes/time-base-wall-clock-vs-monotonic",
    title: "time base",
    date: "2026-04-07",
    summary: "为什么 wall clock 会把系统搞乱",
    lang: "zh-CN" as const,
  },
  {
    href: "/notes/blocking-why-systems-get-stuck",
    title: "blocking",
    date: "2026-04-07",
    summary: null,
    lang: "zh-CN" as const,
  },
  {
    href: "/notes/older-note",
    title: "older",
    date: "2026-04-06",
    summary: "更早一天",
    lang: "zh-CN" as const,
  },
];

test("buildNotesTimelineGroups groups notes by day in reverse chronological order", () => {
  const groups = buildNotesTimelineGroups(zhNotes);

  assert.equal(groups.length, 2);
  assert.equal(groups[0]?.dateKey, "2026-04-07");
  assert.equal(groups[0]?.items.length, 2);
  assert.equal(groups[1]?.dateKey, "2026-04-06");
});

test("buildNotesTimelineGroups exposes archive-style timeline labels and summary fallback", () => {
  const [group] = buildNotesTimelineGroups(zhNotes);
  const secondCard = group?.items[1];

  assert.deepEqual(group?.timelineLabel, {
    monthShort: "Apr",
    dayNumber: "07",
  });
  assert.equal(secondCard?.summary, "");
});
```

- [ ] **Step 2: Run the test and verify the red state**

Run: `node --experimental-strip-types --test scripts/tests/notes-timeline.test.mts`

Expected: FAIL with a module resolution error because `../../src/lib/notes-timeline.ts` does not exist yet.

- [ ] **Step 3: Add the grouping helper with the smallest API that satisfies the test**

```ts
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

    if (existing) {
      existing.items.push({
        href: note.href,
        title: note.title,
        summary: note.summary ?? "",
        date: note.date,
        lang: note.lang,
      });
      continue;
    }

    groups.set(dateKey, {
      dateKey,
      timelineLabel: formatTimelineLabel(dateKey),
      items: [
        {
          href: note.href,
          title: note.title,
          summary: note.summary ?? "",
          date: note.date,
          lang: note.lang,
        },
      ],
    });
  }

  return [...groups.values()].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
```

- [ ] **Step 4: Run the helper test and verify the green state**

Run: `node --experimental-strip-types --test scripts/tests/notes-timeline.test.mts`

Expected: PASS with `2 tests` and `0 failures`.

- [ ] **Step 5: Commit the helper and test**

```bash
git add src/lib/notes-timeline.ts scripts/tests/notes-timeline.test.mts
git commit -F- <<'EOF'
feat(notes): add timeline grouping helper

1. 新增 notes 首页按天分组工具, 输出时间轴标签和卡片所需的最小数据结构.
2. 用独立测试锁定倒序分组, 档案式日期标签和摘要兜底行为.
3. 为后续首页时间轴布局改造准备稳定的数据边界.
EOF
```

## Task 2: Rebuild the Notes Index Components Around Daily Timeline Sections

**Files:**
- Modify: `src/components/notes/notes-grid.tsx`
- Modify: `src/components/notes/note-card.tsx`
- Modify: `src/app/globals.css`
- Create: `scripts/tests/notes-grid-component.test.mts`
- Test: `scripts/tests/notes-timeline.test.mts`
- Test: `scripts/tests/notes-grid-component.test.mts`

- [ ] **Step 1: Write a failing source-level test for the grouped notes UI**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notes grid uses the timeline helper and timeline-specific layout classes", async () => {
  const gridSource = await readFile("src/components/notes/notes-grid.tsx", "utf8");
  const cardSource = await readFile("src/components/notes/note-card.tsx", "utf8");

  assert.match(gridSource, /buildNotesTimelineGroups/);
  assert.match(gridSource, /notes-timeline/);
  assert.match(gridSource, /timelineLabel\.monthShort/);
  assert.match(gridSource, /timelineLabel\.dayNumber/);

  assert.match(cardSource, /aspect-square/);
  assert.doesNotMatch(cardSource, /formatDateCompact/);
});
```

- [ ] **Step 2: Run the source-level test and verify the red state**

Run: `node --test --experimental-strip-types scripts/tests/notes-grid-component.test.mts`

Expected: FAIL because the current list component does not call `buildNotesTimelineGroups`, does not contain the timeline classes, and the current card still imports `formatDateCompact`.

- [ ] **Step 3: Rework `NotesGrid` into a grouped timeline layout**

```tsx
import { NoteCard, type NoteTeaser } from "@/components/notes/note-card";
import type { Locale } from "@/lib/i18n";
import { buildNotesTimelineGroups } from "@/lib/notes-timeline";
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

  const groups = buildNotesTimelineGroups(notes);

  return (
    <div className="notes-timeline space-y-10 md:space-y-12">
      {groups.map((group, index) => (
        <section
          key={group.dateKey}
          className="grid grid-cols-[76px_minmax(0,1fr)] gap-x-4 md:grid-cols-[112px_minmax(0,1fr)] md:gap-x-6"
        >
          <div className="notes-timeline-marker">
            <div className="notes-timeline-spine" aria-hidden={index === groups.length - 1} />
            <div className="notes-timeline-node" />
            <p className="notes-timeline-month">{group.timelineLabel.monthShort}</p>
            <p className="notes-timeline-day">{group.timelineLabel.dayNumber}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
            {group.items.map((note) => (
              <NoteCard key={note.href} note={note} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Rework `NoteCard` into a near-square title-first card**

```tsx
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
          "flex min-h-[172px] h-full flex-col justify-between rounded-[22px] border border-[rgba(36,41,47,0.07)] bg-[rgba(255,255,255,0.92)] px-4 py-4 shadow-[0_14px_32px_rgba(36,41,47,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,41,47,0.08)] sm:aspect-square",
          locale === "zh-CN" && "font-reading-zh"
        )}
      >
        <h2 className="line-clamp-2 text-[17px] font-semibold leading-[1.35] tracking-[-0.03em] text-[rgba(36,41,47,0.96)]">
          {note.title}
        </h2>
        <p className="mt-4 line-clamp-2 text-[13px] leading-[1.65] text-[rgba(85,85,85,0.78)]">
          {note.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}
```

- [ ] **Step 5: Add the minimal timeline utilities to `src/app/globals.css`**

```css
.notes-timeline-marker {
  position: relative;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 6px;
}

.notes-timeline-spine {
  position: absolute;
  left: 12px;
  top: 30px;
  bottom: -44px;
  width: 1px;
  background: rgba(36, 41, 47, 0.12);
}

.notes-timeline-node {
  position: relative;
  z-index: 1;
  height: 14px;
  width: 14px;
  border-radius: 999px;
  border: 3px solid rgba(245, 243, 238, 0.98);
  background: rgba(36, 41, 47, 0.88);
}

.notes-timeline-month {
  margin-top: 12px;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(85, 85, 85, 0.62);
}

.notes-timeline-day {
  margin-top: 6px;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
  color: rgba(36, 41, 47, 0.94);
}
```

- [ ] **Step 6: Run the helper and source-level UI tests and verify the green state**

Run: `node --experimental-strip-types --test scripts/tests/notes-timeline.test.mts && node --test --experimental-strip-types scripts/tests/notes-grid-component.test.mts`

Expected: PASS with all timeline-grouping assertions still green after the UI refactor, and the source-level UI assertions now satisfied.

- [ ] **Step 7: Commit the component and style changes**

```bash
git add src/components/notes/notes-grid.tsx src/components/notes/note-card.tsx src/app/globals.css scripts/tests/notes-timeline.test.mts scripts/tests/notes-grid-component.test.mts
git commit -F- <<'EOF'
feat(notes): redesign notes index as timeline grid

1. 将 notes 首页列表改成按天分组的时间轴布局, 左侧展示日期节点, 右侧展示当日卡片阵列.
2. 将 note 卡片调整为标题优先的近正方形结构, 保留一行摘要并去掉重复日期信息.
3. 补充首页时间轴样式和分组顺序测试, 固化页面节奏与卡片密度.
EOF
```

## Task 3: Wire the Page Shell, Route-Level Checks, and Final Verification

**Files:**
- Modify: `src/app/notes/page.tsx`
- Modify: `src/app/en/notes/page.tsx`
- Modify: `scripts/tests/notes-index-page.test.mts`
- Test: `scripts/tests/notes-grid-component.test.mts`
- Test: `scripts/tests/notes-index-page.test.mts`
- Test: `scripts/tests/notes-timeline.test.mts`

- [ ] **Step 1: Update the route-wiring test to reflect the redesigned notes index contract**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notes index pages keep using notes-specific data and list components", async () => {
  const zhSource = await readFile("src/app/notes/page.tsx", "utf8");
  const enSource = await readFile("src/app/en/notes/page.tsx", "utf8");

  for (const source of [zhSource, enSource]) {
    assert.match(source, /import \{ NotesGrid \} from ["']@\/components\/notes\/notes-grid["'];/);
    assert.match(source, /import \{ getNotesByLocale \} from ["']@\/lib\/content["'];/);
    assert.match(source, /const notes = getNotesByLocale\(".*"\);/);
    assert.match(source, /<NotesGrid notes=\{notes\} locale=".*" \/>/);
    assert.match(source, /max-w-\[/);

    assert.doesNotMatch(source, /BlogList/);
    assert.doesNotMatch(source, /getBlogsByLocale/);
  }
});
```

- [ ] **Step 2: Run the route-wiring test and verify the red state**

Run: `node --test --experimental-strip-types scripts/tests/notes-index-page.test.mts`

Expected: FAIL after adding the new `max-w-[...]` assertion if the page shell has not been widened yet.

- [ ] **Step 3: Widen the notes page shells for the denser grouped layout**

```tsx
export default function NotesPage() {
  const notes = getNotesByLocale("zh-CN");

  return (
    <div className="mx-auto w-full max-w-[1680px] px-4 py-4 sm:px-4 md:px-6 md:py-8 2xl:px-8">
      <NotesGrid notes={notes} locale="zh-CN" />
    </div>
  );
}
```

Apply the same container change to `src/app/en/notes/page.tsx`, keeping only the locale string different.

- [ ] **Step 4: Run all notes index tests and verify the green state**

Run: `node --experimental-strip-types --test scripts/tests/notes-timeline.test.mts && node --test --experimental-strip-types scripts/tests/notes-grid-component.test.mts && node --test --experimental-strip-types scripts/tests/notes-index-page.test.mts`

Expected: PASS with all timeline grouping assertions, component-structure checks, and route-level checks green.

- [ ] **Step 5: Build the app for a full integration check**

Run: `pnpm build`

Expected: Successful Next.js production build with no type or route regressions.

- [ ] **Step 6: Commit the page-shell and verification updates**

```bash
git add src/app/notes/page.tsx src/app/en/notes/page.tsx scripts/tests/notes-index-page.test.mts
git commit -F- <<'EOF'
feat(notes): tune notes index shell for timeline layout

1. 调整中英文 notes 首页容器宽度, 为按天分组时间轴卡片墙提供更高的桌面端密度上限.
2. 更新首页路由接线测试, 锁定 notes 专属数据入口和页面壳层约束.
3. 通过脚本测试和构建验证首页改造没有破坏现有路由与构建流程.
EOF
```

## Self-Review Checklist

### Spec coverage

1. Day-grouped timeline structure is covered in Task 1 and Task 2.
2. Near-square, title-first cards are covered in Task 2.
3. Denser desktop layout and bilingual shell updates are covered in Task 3.
4. No detail-page changes, no new schema, and no exact timestamps are preserved by the task boundaries.

### Placeholder scan

1. No `TODO`, `TBD`, or deferred implementation markers remain in the tasks.
2. Every code-bearing step includes concrete file targets, code snippets, and verification commands.

### Type consistency

1. The helper API consistently uses `buildNotesTimelineGroups`.
2. The grouped structure consistently uses `timelineLabel.monthShort`, `timelineLabel.dayNumber`, and `items`.
3. `NoteTeaser` remains the card-facing item type across the list and card components.
