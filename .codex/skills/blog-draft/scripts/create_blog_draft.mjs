#!/usr/bin/env node

import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRoot = path.resolve(__dirname, "..", "..", "..", "..");

function usage() {
  return [
    "Usage:",
    "  create_blog_draft.mjs [--root PATH] [--date YYYY-MM-DD] [--dry-run] <slug> <zh-title> <en-title>",
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    root: defaultRoot,
    date: null,
    dryRun: false,
    positionals: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      return { help: true };
    }

    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (token === "--root") {
      options.root = argv[index + 1];
      index += 1;
      continue;
    }

    if (token.startsWith("--root=")) {
      options.root = token.slice("--root=".length);
      continue;
    }

    if (token === "--date") {
      options.date = argv[index + 1];
      index += 1;
      continue;
    }

    if (token.startsWith("--date=")) {
      options.date = token.slice("--date=".length);
      continue;
    }

    options.positionals.push(token);
  }

  return options;
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function validateIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateSlug(slug) {
  if (!hasText(slug)) {
    throw new Error("slug is required");
  }

  if (slug.startsWith("/") || slug.endsWith("/") || slug.includes("\\") || slug.includes("..")) {
    throw new Error(`invalid slug: ${slug}`);
  }
}

function quote(value) {
  return JSON.stringify(value);
}

function makeFrontmatter({ title, date, lang, translationKey }) {
  return [
    "---",
    `title: ${quote(title)}`,
    `date: ${quote(date)}`,
    "featured: false",
    'summary: ""',
    "keywords: []",
    `lang: ${quote(lang)}`,
    `translationKey: ${quote(translationKey)}`,
    "---",
  ].join("\n");
}

function makeZhBody(title) {
  return [
    `# ${title}`,
    "",
    "## 为什么写这个",
    "",
    "先写这个主题为什么值得单独成文, 它解决了什么问题, 或者提供了什么判断.",
    "",
    "## 关键判断",
    "",
    "- ",
    "",
    "## 过程与证据",
    "",
    "- ",
    "",
    "## 可复用的方法",
    "",
    "- ",
    "",
  ].join("\n");
}

function makeEnBody(title) {
  return [
    `# ${title}`,
    "",
    "## Why write this",
    "",
    "Start with why this topic deserves a full post, what problem it resolves, or what judgment it makes concrete.",
    "",
    "## Key judgment",
    "",
    "- ",
    "",
    "## Process and evidence",
    "",
    "- ",
    "",
    "## Reusable method",
    "",
    "- ",
    "",
  ].join("\n");
}

async function ensureWritable(paths) {
  const existing = [];

  for (const targetPath of paths) {
    try {
      await access(targetPath);
      existing.push(targetPath);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  if (existing.length > 0) {
    throw new Error(`draft already exists:\n${existing.join("\n")}`);
  }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.help) {
    console.log(usage());
    return;
  }

  const [slug, zhTitle, enTitle] = parsed.positionals;
  const date = parsed.date ?? formatToday();

  validateSlug(slug);

  if (!hasText(zhTitle) || !hasText(enTitle)) {
    throw new Error("both zh and en titles are required");
  }

  if (!validateIsoDate(date)) {
    throw new Error(`invalid date: ${date}`);
  }

  const repoRoot = path.resolve(parsed.root);
  const zhPath = path.join(repoRoot, "src/content/blog/zh", `${slug}.md`);
  const enPath = path.join(repoRoot, "src/content/blog/en", `${slug}.md`);

  if (!parsed.dryRun) {
    await ensureWritable([zhPath, enPath]);
    await mkdir(path.dirname(zhPath), { recursive: true });
    await mkdir(path.dirname(enPath), { recursive: true });
    await writeFile(
      zhPath,
      `${makeFrontmatter({
        title: zhTitle,
        date,
        lang: "zh-CN",
        translationKey: slug,
      })}\n\n${makeZhBody(zhTitle)}`,
      "utf8"
    );
    await writeFile(
      enPath,
      `${makeFrontmatter({
        title: enTitle,
        date,
        lang: "en-US",
        translationKey: slug,
      })}\n\n${makeEnBody(enTitle)}`,
      "utf8"
    );
  }

  console.log(`blog draft ready: ${path.relative(repoRoot, zhPath)} | ${path.relative(repoRoot, enPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  console.error(usage());
  process.exit(1);
});
