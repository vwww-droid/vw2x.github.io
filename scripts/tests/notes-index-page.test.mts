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
    assert.match(source, /max-w-\[1680px\]/);

    assert.doesNotMatch(source, /BlogList/);
    assert.doesNotMatch(source, /getBlogsByLocale/);
  }
});
