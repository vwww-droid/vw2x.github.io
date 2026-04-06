import test from "node:test";
import assert from "node:assert/strict";

import {
  getNotesByLocale,
  getTranslatedNote,
  getTranslatedWeeklyIssue,
  getWeeklyIssuesByLocale,
} from "../../src/lib/content.ts";

test("weekly seed issue has both language variants", () => {
  const zh = getWeeklyIssuesByLocale("zh-CN");
  const en = getWeeklyIssuesByLocale("en-US");

  assert.equal(zh[0]?.translationKey, "2615-start-recording");
  assert.equal(en[0]?.translationKey, "2615-start-recording");
  assert.equal(zh[0]?.slug, "2615-start-recording");
  assert.equal(en[0]?.slug, "2615-start-recording");
  assert.ok(getTranslatedWeeklyIssue("zh-CN", "2615-start-recording"));
  assert.ok(getTranslatedWeeklyIssue("en-US", "2615-start-recording"));
});

test("notes helpers return arrays and null for missing translation pairs", () => {
  assert.ok(Array.isArray(getNotesByLocale("zh-CN")));
  assert.ok(Array.isArray(getNotesByLocale("en-US")));
  assert.equal(getTranslatedNote("zh-CN", "missing-note"), null);
  assert.equal(getTranslatedNote("en-US", "missing-note"), null);
});
