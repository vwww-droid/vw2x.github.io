#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const contentRoot = path.join(repoRoot, "src/content");

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function walkMarkdownFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walkMarkdownFiles(fullPath)));
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }

    return files;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

function toPosixRelative(filePath, baseDir) {
  return path.relative(baseDir, filePath).split(path.sep).join("/");
}

function parseDocument(filePath, domain, locale, source) {
  const { data } = matter(source);
  const relativePath = toPosixRelative(filePath, path.join(contentRoot, domain, locale));
  const slug = relativePath.replace(/\.md$/, "");
  const errors = [];

  if (!hasText(data.title)) {
    errors.push("missing frontmatter field: title");
  }

  if (!hasText(data.date)) {
    errors.push("missing frontmatter field: date");
  } else if (!isIsoDate(data.date)) {
    errors.push(`invalid date format: ${data.date}`);
  }

  if (data.lang !== (locale === "zh" ? "zh-CN" : "en-US")) {
    errors.push(`lang mismatch: expected ${locale === "zh" ? "zh-CN" : "en-US"}, got ${data.lang ?? "(missing)"}`);
  }

  if (!hasText(data.translationKey)) {
    errors.push("missing frontmatter field: translationKey");
  } else if (data.translationKey !== slug) {
    errors.push(`translationKey mismatch: expected ${slug}, got ${data.translationKey}`);
  }

  if (domain === "weekly") {
    if (typeof data.issue !== "number" || !Number.isInteger(data.issue) || data.issue <= 0) {
      errors.push("missing or invalid frontmatter field: issue");
    }
  }

  return {
    filePath,
    slug,
    data,
    errors,
  };
}

function groupBySlug(documents) {
  const groups = new Map();

  for (const document of documents) {
    const existing = groups.get(document.slug) ?? { zh: null, en: null };
    existing[document.locale] = document;
    groups.set(document.slug, existing);
  }

  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
}

async function verifyDomain(domain) {
  const zhFiles = await walkMarkdownFiles(path.join(contentRoot, domain, "zh"));
  const enFiles = await walkMarkdownFiles(path.join(contentRoot, domain, "en"));
  const documents = [];

  for (const filePath of zhFiles) {
    documents.push({
      ...parseDocument(filePath, domain, "zh", await readFile(filePath, "utf8")),
      locale: "zh",
    });
  }

  for (const filePath of enFiles) {
    documents.push({
      ...parseDocument(filePath, domain, "en", await readFile(filePath, "utf8")),
      locale: "en",
    });
  }

  const errors = [];
  const groups = groupBySlug(documents);

  for (const [slug, pair] of groups) {
    if (!pair.zh) {
      errors.push(`${domain}/${slug}: missing zh pair`);
    }

    if (!pair.en) {
      errors.push(`${domain}/${slug}: missing en pair`);
    }

    for (const side of [pair.zh, pair.en]) {
      if (side) {
        for (const error of side.errors) {
          errors.push(`${toPosixRelative(side.filePath, repoRoot)}: ${error}`);
        }
      }
    }

    if (pair.zh && pair.en) {
      if (pair.zh.data.translationKey !== pair.en.data.translationKey) {
        errors.push(
          `${domain}/${slug}: translationKey mismatch between zh and en files`
        );
      }

      if (pair.zh.data.date !== pair.en.data.date) {
        errors.push(`${domain}/${slug}: date mismatch between zh and en files`);
      }

      if (domain === "weekly" && pair.zh.data.issue !== pair.en.data.issue) {
        errors.push(`${domain}/${slug}: issue mismatch between zh and en files`);
      }
    }
  }

  return errors;
}

async function main() {
  const errors = [
    ...(await verifyDomain("weekly")),
    ...(await verifyDomain("notes")),
  ];

  if (errors.length > 0) {
    console.error("Bilingual weekly/notes verification failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Bilingual weekly/notes verification passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
