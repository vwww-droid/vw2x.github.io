import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notes grid uses the timeline helper and timeline-specific layout classes", async () => {
  const gridSource = await readFile("src/components/notes/notes-grid.tsx", "utf8");
  const cardSource = await readFile("src/components/notes/note-card.tsx", "utf8");
  const globalsSource = await readFile("src/app/globals.css", "utf8");

  assert.match(gridSource, /buildNotesTimelineGroups/);
  assert.match(gridSource, /notes-timeline/);
  assert.match(gridSource, /group\.items\.map/);
  assert.match(gridSource, /timelineLabel\.monthShort/);
  assert.match(gridSource, /timelineLabel\.dayNumber/);
  assert.match(gridSource, /notes-timeline-cards/);

  assert.match(cardSource, /aspect-square/);
  assert.doesNotMatch(cardSource, /formatDateCompact/);
  assert.doesNotMatch(cardSource, /date:\s*string/);
  assert.match(cardSource, /export type NoteCardTeaser =/);
  assert.match(cardSource, /note:\s*NoteCardTeaser/);
  assert.match(cardSource, /href=\{note\.href\}/);
  assert.match(cardSource, /note\.title/);
  assert.match(cardSource, /note\.summary \?\? ""/);

  assert.match(globalsSource, /\.notes-timeline-marker\s*\{/);
  assert.match(globalsSource, /\.notes-timeline-spine\s*\{/);
  assert.match(globalsSource, /\.notes-timeline-node\s*\{/);
  assert.match(globalsSource, /\.notes-timeline-month\s*\{/);
  assert.match(globalsSource, /\.notes-timeline-day\s*\{/);
  assert.match(
    globalsSource,
    /\.notes-timeline\s*>\s*:last-child\s+\.notes-timeline-spine\s*\{/
  );
  assert.match(globalsSource, /\.notes-timeline-cards\s*\{/);
  assert.match(globalsSource, /repeat\(\s*auto-fill,\s*minmax\(/);
  assert.match(globalsSource, /justify-content:\s*start/);
  assert.match(globalsSource, /--notes-timeline-spine-offset/);
});
