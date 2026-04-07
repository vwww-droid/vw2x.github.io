import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notes index pages keep using notes-specific data and list components", async () => {
  const zhSource = await readFile("src/app/notes/page.tsx", "utf8");
  const enSource = await readFile("src/app/en/notes/page.tsx", "utf8");

  assert.match(zhSource, /import \{ NotesGrid \} from ["']@\/components\/notes\/notes-grid["'];/);
  assert.match(zhSource, /import \{ getNotesByLocale \} from ["']@\/lib\/content["'];/);
  assert.match(zhSource, /const notes = getNotesByLocale\("zh-CN"\);/);
  assert.match(zhSource, /<NotesGrid notes=\{notes\} locale="zh-CN" \/>/);
  assert.match(zhSource, /max-w-\[1680px\]/);
  assert.doesNotMatch(zhSource, /BlogList/);
  assert.doesNotMatch(zhSource, /getBlogsByLocale/);

  assert.match(enSource, /import \{ NotesGrid \} from ["']@\/components\/notes\/notes-grid["'];/);
  assert.match(enSource, /import \{ getNotesByLocale \} from ["']@\/lib\/content["'];/);
  assert.match(enSource, /const notes = getNotesByLocale\("en-US"\);/);
  assert.match(enSource, /<NotesGrid notes=\{notes\} locale="en-US" \/>/);
  assert.match(enSource, /max-w-\[1680px\]/);
  assert.doesNotMatch(enSource, /BlogList/);
  assert.doesNotMatch(enSource, /getBlogsByLocale/);
});
