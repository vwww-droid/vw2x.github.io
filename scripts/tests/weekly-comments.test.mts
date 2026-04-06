import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("weekly issue page wires in the comments section", async () => {
  const source = await readFile("src/components/weekly/weekly-issue-page.tsx", "utf8");
  const css = await readFile("src/app/globals.css", "utf8");

  assert.match(source, /import GiscusComments from ["']@\/components\/giscus-comments["'];/);
  assert.match(source, /aria-labelledby="comments-heading"/);
  assert.match(source, /<GiscusComments lang=\{locale\} \/>/);
  assert.match(source, /weekly-comments-panel/);
  assert.match(css, /\.weekly-comments-panel\s*\{/);
  assert.doesNotMatch(source, /weekly-comments-kicker/);
  assert.doesNotMatch(source, /weekly-comments-title/);
  assert.doesNotMatch(source, /weekly-comments-lead/);
  assert.doesNotMatch(css, /\.weekly-comments-kicker\s*\{/);
  assert.doesNotMatch(css, /\.weekly-comments-title\s*\{/);
  assert.doesNotMatch(css, /\.weekly-comments-lead\s*\{/);
});
