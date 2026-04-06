import test from "node:test";
import assert from "node:assert/strict";

import {
  getCollectionIndexHref,
  getCollectionItemHref,
} from "../../src/lib/publication-routes.ts";

test("builds index hrefs for all publication domains", () => {
  assert.equal(getCollectionIndexHref("blog", "zh-CN"), "/blog");
  assert.equal(getCollectionIndexHref("blog", "en-US"), "/en/blog");
  assert.equal(getCollectionIndexHref("weekly", "zh-CN"), "/weekly");
  assert.equal(getCollectionIndexHref("weekly", "en-US"), "/en/weekly");
  assert.equal(getCollectionIndexHref("notes", "zh-CN"), "/notes");
  assert.equal(getCollectionIndexHref("notes", "en-US"), "/en/notes");
});

test("builds detail hrefs for all publication domains", () => {
  assert.equal(getCollectionItemHref("blog", "zh-CN", "demo"), "/blog/demo");
  assert.equal(getCollectionItemHref("blog", "en-US", "demo"), "/en/blog/demo");
  assert.equal(getCollectionItemHref("weekly", "zh-CN", "demo"), "/weekly/demo");
  assert.equal(getCollectionItemHref("weekly", "en-US", "demo"), "/en/weekly/demo");
  assert.equal(getCollectionItemHref("notes", "zh-CN", "demo"), "/notes/demo");
  assert.equal(getCollectionItemHref("notes", "en-US", "demo"), "/en/notes/demo");
});
