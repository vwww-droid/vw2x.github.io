import test from "node:test";
import assert from "node:assert/strict";

import { getSearchDocumentsByLocale } from "../../src/lib/content.ts";

test("search documents stay globally sorted by date across content domains", () => {
  const zhDocuments = getSearchDocumentsByLocale("zh-CN");
  const enDocuments = getSearchDocumentsByLocale("en-US");

  assert.equal(zhDocuments[0]?.translationKey, "2615-start-recording");
  assert.equal(enDocuments[0]?.translationKey, "2615-start-recording");
});
