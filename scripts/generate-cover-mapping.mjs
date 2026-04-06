#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const coversFilePath = path.join(repoRoot, "src/content/covers/generated-covers.json");
const blogRoot = path.join(repoRoot, "src/content/blog");

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

function stripWrappingQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {};
  }

  const frontmatter = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontmatter[key] = stripWrappingQuotes(value);
  }

  return frontmatter;
}

function hasNonEmptyValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function walkMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of [...entries].sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function readGeneratedCoverMap() {
  try {
    const raw = await readFile(coversFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function scanArticles() {
  const files = await walkMarkdownFiles(blogRoot);
  const articles = [];

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8");
    const frontmatter = parseFrontmatter(source);
    const translationKey =
      (frontmatter.translationKey && frontmatter.translationKey.trim()) ||
      path.basename(filePath, path.extname(filePath));
    const title = frontmatter.title || translationKey;
    const lang = frontmatter.lang || "";
    const cover = frontmatter.cover;
    const coverAlt = frontmatter.coverAlt;

    articles.push({
      filePath,
      title,
      translationKey,
      lang,
      hasExplicitCover: hasNonEmptyValue(cover),
      coverAlt: hasNonEmptyValue(coverAlt) ? coverAlt.trim() : undefined,
    });
  }

  return articles;
}

function buildQuery(article) {
  return article.title.replace(/\s+/g, " ").trim();
}

function compareQueryPriority(left, right) {
  const priority = (article) => {
    if (article.lang === "en-US") {
      return 0;
    }

    if (article.lang === "zh-CN") {
      return 1;
    }

    return 2;
  };

  const diff = priority(left) - priority(right);
  if (diff !== 0) {
    return diff;
  }

  return left.filePath.localeCompare(right.filePath);
}

function selectQueryArticle(articles) {
  return [...articles].sort(compareQueryPriority)[0] ?? null;
}

function groupCandidates(articles, generatedCoverMap) {
  const groups = new Map();

  for (const article of articles) {
    const existing = groups.get(article.translationKey) ?? {
      translationKey: article.translationKey,
      queryArticle: null,
      files: [],
      missingExplicitCoverFiles: [],
      hasCachedMapping: Boolean(generatedCoverMap[article.translationKey]?.src),
      articles: [],
    };

    existing.files.push(article.filePath);
    existing.articles.push(article);
    if (!article.hasExplicitCover) {
      existing.missingExplicitCoverFiles.push(article.filePath);
    }

    groups.set(article.translationKey, existing);
  }

  return [...groups.values()]
    .filter((group) => !group.hasCachedMapping && group.missingExplicitCoverFiles.length > 0)
    .map((group) => ({
      ...group,
      queryArticle: selectQueryArticle(group.articles),
    }))
    .sort((a, b) => a.translationKey.localeCompare(b.translationKey));
}

async function fetchUnsplashCover(query, apiKey) {
  const searchUrl = new URL("https://api.unsplash.com/search/photos");
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("per_page", "1");
  searchUrl.searchParams.set("orientation", "landscape");
  searchUrl.searchParams.set("content_filter", "high");

  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Client-ID ${apiKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const photo = payload?.results?.[0];
  if (!photo) {
    return null;
  }

  return {
    src: photo.urls?.regular || photo.urls?.small || photo.urls?.raw || null,
    alt: photo.alt_description || photo.description || null,
  };
}

function serializeCoverMap(map) {
  const ordered = Object.fromEntries(
    Object.entries(map).sort(([left], [right]) => left.localeCompare(right))
  );
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));
  const generatedCoverMap = await readGeneratedCoverMap();
  const articles = await scanArticles();
  const candidates = groupCandidates(articles, generatedCoverMap);
  const apiKey = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;

  console.log(`[generate-cover-mapping] scanned ${articles.length} articles`);
  console.log(
    `[generate-cover-mapping] ${candidates.length} translation keys need coverage updates`
  );

  for (const candidate of candidates) {
    console.log(`- ${candidate.translationKey}`);
    console.log(`  title: ${candidate.queryArticle?.title ?? candidate.translationKey}`);
    console.log(`  locale: ${candidate.queryArticle?.lang ?? "unknown"}`);
    console.log(`  files: ${candidate.missingExplicitCoverFiles.length}`);
    console.log(`  query: ${buildQuery(candidate.queryArticle ?? candidate)}`);
    if (generatedCoverMap[candidate.translationKey]?.src) {
      console.log(`  cache: hit`);
    } else {
      console.log(`  cache: miss`);
    }
  }

  if (dryRun || !apiKey) {
    if (!apiKey && candidates.length > 0 && !dryRun) {
      console.log(
        "[generate-cover-mapping] no Unsplash API key detected, skipped remote fetch"
      );
    }

    return;
  }

  const nextMap = { ...generatedCoverMap };
  let updatedCount = 0;

  for (const candidate of candidates) {
    const queryArticle = candidate.queryArticle ?? candidate.articles[0];
    const generated = await fetchUnsplashCover(buildQuery(queryArticle), apiKey);
    if (!generated?.src) {
      console.log(`- skipped ${candidate.translationKey}: no Unsplash result`);
      continue;
    }

    nextMap[candidate.translationKey] = {
      src: generated.src,
      alt: generated.alt || queryArticle.title,
    };
    updatedCount += 1;
    console.log(`- updated ${candidate.translationKey}`);
  }

  if (updatedCount > 0) {
    await writeFile(coversFilePath, serializeCoverMap(nextMap), "utf8");
    console.log(
      `[generate-cover-mapping] wrote ${updatedCount} cover mapping(s) to ${path.relative(
        repoRoot,
        coversFilePath
      )}`
    );
    return;
  }

  console.log("[generate-cover-mapping] no changes written");
}

main().catch((error) => {
  console.error("[generate-cover-mapping] failed");
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
