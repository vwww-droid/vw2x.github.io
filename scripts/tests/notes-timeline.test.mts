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
  const groups = buildNotesTimelineGroups(zhNotes, "zh-CN");

  assert.equal(groups.length, 2);
  assert.equal(groups[0]?.dateKey, "2026-04-07");
  assert.equal(groups[0]?.items.length, 2);
  assert.equal(groups[1]?.dateKey, "2026-04-06");
});

test("buildNotesTimelineGroups exposes locale-aware timeline labels and summary fallback", () => {
  const [group] = buildNotesTimelineGroups(zhNotes, "zh-CN");
  const secondCard = group?.items[1];

  assert.deepEqual(group?.timelineLabel, {
    monthShort: "Apr",
    dayNumber: "07",
  });
  assert.equal(secondCard?.summary, "");
});
