#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

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
    const { data } = matter(source);
    const translationKey = hasNonEmptyValue(data.translationKey)
      ? data.translationKey.trim()
      : path.basename(filePath, path.extname(filePath));
    const title = hasNonEmptyValue(data.title) ? data.title.trim() : translationKey;
    const lang = hasNonEmptyValue(data.lang) ? data.lang.trim() : "";
    const cover = hasNonEmptyValue(data.cover) ? data.cover.trim() : "";
    const coverAlt = hasNonEmptyValue(data.coverAlt) ? data.coverAlt.trim() : "";

    articles.push({
      filePath,
      title,
      translationKey,
      lang,
      cover,
      coverAlt,
      hasExplicitCover: hasNonEmptyValue(cover),
    });
  }

  return articles;
}

function buildQueryFromArticle(article) {
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

function groupArticlesByTranslationKey(articles, generatedCoverMap) {
  const groups = new Map();

  for (const article of articles) {
    const existing = groups.get(article.translationKey) ?? {
      translationKey: article.translationKey,
      articles: [],
      files: [],
      missingExplicitCoverFiles: [],
      hasCachedMapping: Boolean(generatedCoverMap[article.translationKey]?.src),
    };

    existing.files.push(article.filePath);
    existing.articles.push(article);
    if (!article.hasExplicitCover) {
      existing.missingExplicitCoverFiles.push(article.filePath);
    }

    groups.set(article.translationKey, existing);
  }

  return [...groups.values()].sort((left, right) =>
    left.translationKey.localeCompare(right.translationKey)
  );
}

function buildQuerySelection(group) {
  const article = selectQueryArticle(group.articles);
  if (!article) {
    return null;
  }

  return {
    translationKey: group.translationKey,
    article,
    query: buildQueryFromArticle(article),
  };
}

function buildPendingMappings(groups) {
  const pendingMappings = groups
    .filter((group) => !group.hasCachedMapping && group.missingExplicitCoverFiles.length > 0)
    .map((group) => {
      const querySelection = buildQuerySelection(group);
      if (!querySelection) {
        return null;
      }

      return {
        translationKey: group.translationKey,
        querySelection,
        sourceFiles: [...group.files],
        missingExplicitCoverFiles: [...group.missingExplicitCoverFiles],
      };
    })
    .filter((mapping) => mapping !== null);

  return pendingMappings;
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
  const groupedArticles = groupArticlesByTranslationKey(articles, generatedCoverMap);
  const pendingMappings = buildPendingMappings(groupedArticles);
  const apiKey = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;

  console.log(`[generate-cover-mapping] scanned ${articles.length} articles`);
  console.log(
    `[generate-cover-mapping] ${pendingMappings.length} translation keys need coverage updates`
  );

  for (const pendingMapping of pendingMappings) {
    const { querySelection } = pendingMapping;
    console.log(`- ${pendingMapping.translationKey}`);
    console.log(`  title: ${querySelection.article.title}`);
    console.log(`  locale: ${querySelection.article.lang || "unknown"}`);
    console.log(`  files: ${pendingMapping.missingExplicitCoverFiles.length}`);
    console.log(`  query: ${querySelection.query}`);
    if (generatedCoverMap[pendingMapping.translationKey]?.src) {
      console.log(`  cache: hit`);
    } else {
      console.log(`  cache: miss`);
    }
  }

  if (dryRun || !apiKey) {
    if (!apiKey && pendingMappings.length > 0 && !dryRun) {
      console.log(
        "[generate-cover-mapping] no Unsplash API key detected, skipped remote fetch"
      );
    }

    return;
  }

  const nextMap = { ...generatedCoverMap };
  let updatedCount = 0;

  for (const pendingMapping of pendingMappings) {
    const { querySelection } = pendingMapping;
    const generated = await fetchUnsplashCover(querySelection.query, apiKey);
    if (!generated?.src) {
      console.log(`- skipped ${pendingMapping.translationKey}: no Unsplash result`);
      continue;
    }

    nextMap[pendingMapping.translationKey] = {
      src: generated.src,
      alt: generated.alt || querySelection.article.title,
    };
    updatedCount += 1;
    console.log(`- updated ${pendingMapping.translationKey}`);
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
