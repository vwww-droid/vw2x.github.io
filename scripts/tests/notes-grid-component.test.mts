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
