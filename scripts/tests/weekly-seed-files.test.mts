import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("seed weekly issue exists in both languages with matching translationKey", async () => {
  const zhPath = "src/content/weekly/zh/2615-start-recording.md";
  const enPath = "src/content/weekly/en/2615-start-recording.md";

  await access(zhPath);
  await access(enPath);

  const [zhSource, enSource] = await Promise.all([
    readFile(zhPath, "utf8"),
    readFile(enPath, "utf8"),
  ]);

  assert.match(zhSource, /title:\s*"2615 - 开始记录"/);
  assert.match(enSource, /title:\s*"2615 - Start Recording"/);
  assert.match(zhSource, /translationKey:\s*"2615-start-recording"/);
  assert.match(enSource, /translationKey:\s*"2615-start-recording"/);
});
