import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const themeFiles = [
  "public/styles/giscus-light.css",
  "public/styles/giscus-dark.css",
];

for (const filePath of themeFiles) {
  test(`${filePath} keeps mobile overflow guards`, async () => {
    const css = await readFile(filePath, "utf8");

    assert.match(css, /overflow-wrap:\s*anywhere;/);
    assert.match(css, /word-break:\s*break-word;/);
    assert.match(css, /@media\s*\(max-width:\s*640px\)/);
    assert.match(css, /\.gsc-reactions-count:after\s*\{[^}]*margin-left:\s*0;/s);
  });
}
