import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("blog draft script creates paired bilingual long-form drafts", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "blog-draft-"));
  const scriptPath = path.resolve(".codex/skills/blog-draft/scripts/create_blog_draft.mjs");

  await execFileAsync(process.execPath, [
    scriptPath,
    "--root",
    tempRoot,
    "--date",
    "2026-04-07",
    "debugging-shell-startup-modes",
    "重新理解 shell 启动方式",
    "Rethinking shell startup modes",
  ]);

  const zhPath = path.join(
    tempRoot,
    "src/content/blog/zh/debugging-shell-startup-modes.md"
  );
  const enPath = path.join(
    tempRoot,
    "src/content/blog/en/debugging-shell-startup-modes.md"
  );

  const zhDraft = await readFile(zhPath, "utf8");
  const enDraft = await readFile(enPath, "utf8");

  assert.match(zhDraft, /title: "重新理解 shell 启动方式"/);
  assert.match(zhDraft, /date: "2026-04-07"/);
  assert.match(zhDraft, /featured: false/);
  assert.match(zhDraft, /summary: ""/);
  assert.match(zhDraft, /keywords: \[\]/);
  assert.match(zhDraft, /lang: "zh-CN"/);
  assert.match(zhDraft, /translationKey: "debugging-shell-startup-modes"/);
  assert.match(zhDraft, /## 为什么写这个/);

  assert.match(enDraft, /title: "Rethinking shell startup modes"/);
  assert.match(enDraft, /date: "2026-04-07"/);
  assert.match(enDraft, /featured: false/);
  assert.match(enDraft, /summary: ""/);
  assert.match(enDraft, /keywords: \[\]/);
  assert.match(enDraft, /lang: "en-US"/);
  assert.match(enDraft, /translationKey: "debugging-shell-startup-modes"/);
  assert.match(enDraft, /## Why write this/);
});
