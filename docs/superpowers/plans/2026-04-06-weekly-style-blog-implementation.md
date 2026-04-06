# Weekly-Style Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual blog into a `tw93/Weekly`-style image-first publication system with stable cover images, updated list/detail layouts, and search results that match the new presentation.

**Architecture:** Keep the existing bilingual routing and content collections, but extend blog metadata with cover fields and a generated cover-mapping file. Build a shared cover-resolution layer, replace the current text-first list and detail components with Weekly-style publication components, and preserve the existing local search architecture while refreshing its presentation. Fallback image generation stays outside runtime rendering so builds remain deterministic.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, content-collections, MDX, local JSON search index, optional Unsplash API integration via Node script

---

## File Map

### Files to Create

- `src/content/covers/generated-covers.json`
  Stores stable fallback cover mappings keyed by `translationKey`.
- `scripts/generate-cover-mapping.mjs`
  Resolves missing covers through `Unsplash API(图片服务接口)` and updates the checked-in mapping file.
- `src/lib/covers.ts`
  Normalizes explicit covers, generated covers, and per-language fallback resolution into one shared utility.
- `src/components/blog/blog-cover-image.tsx`
  Central cover renderer used by list cards, detail hero blocks, and search results.
- `src/components/blog/blog-weekly-card.tsx`
  Weekly-style image-first card for homepage and blog index.
- `src/components/blog/blog-hero.tsx`
  Weekly-style hero section for blog detail pages.

### Files to Modify

- `content-collections.ts`
  Extend blog schema with `cover` and `coverAlt`, expose resolved cover-ready metadata.
- `src/lib/content.ts`
  Include cover metadata in blog/query/search payloads and ensure bilingual pairs share cover resolution.
- `src/components/blog/blog-list.tsx`
  Replace current text-first list rows with Weekly-style cards.
- `src/components/blog/blog-post-page.tsx`
  Replace current plain article header with hero cover + metadata layout.
- `src/components/search/search-modal.tsx`
  Refresh result row layout so it visually matches the new publication style and supports optional thumbnails.
- `src/app/page.tsx`
  Keep homepage shell but render the new Weekly-style list component.
- `src/app/en/page.tsx`
  Same as Chinese homepage for English.
- `src/app/blog/page.tsx`
  Ensure blog index uses the same Weekly-style list feed.
- `src/app/en/blog/page.tsx`
  Ensure English blog index uses the same Weekly-style list feed.
- `src/app/globals.css`
  Add or adjust global utility classes needed for image-first cards, hero treatment, and consistent typography.
- `src/app/layout.tsx`
  If needed, add image-host allowlisting hooks or shared preload behavior only through existing app-level configuration boundaries.
- `src/content/blog/zh/*.md`
  Add `cover` and optional `coverAlt` where explicit images exist.
- `src/content/blog/en/*.md`
  Mirror bilingual metadata expectations where explicit covers are intentionally document-local.
- `package.json`
  Add a script entry for the cover-mapping generator if needed.

### Files to Check During Execution

- `src/lib/config.ts`
  Confirm site-level strings and any image-domain assumptions.
- `src/app/search.json/route.ts`
  Ensure search output includes any new fields required by the redesigned search result cards.

---

### Task 1: Extend Blog Metadata for Covers

**Files:**
- Create: `src/content/covers/generated-covers.json`
- Modify: `content-collections.ts`
- Modify: `src/lib/content.ts`
- Test: `npm run build`

- [ ] **Step 1: Add an empty checked-in cover mapping file**

```json
{}
```

- [ ] **Step 2: Extend the blog collection schema with cover fields**

```ts
schema: (z) => ({
  title: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  featured: z.boolean().optional().default(false),
  summary: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  ...localeSchema(z),
}),
```

- [ ] **Step 3: Add shared cover-aware types to the content layer**

```ts
export type BlogCover = {
  src: string;
  alt: string;
  source: "explicit" | "generated" | "none";
};

export type SearchDocument = {
  title: string;
  url: string;
  date: string;
  summary: string;
  content: string;
  lang: Locale;
  translationKey: string;
  cover?: BlogCover;
};
```

- [ ] **Step 4: Run build to verify schema changes compile**

Run: `npm run build`  
Expected: PASS with all routes generated successfully

- [ ] **Step 5: Commit**

```bash
git add content-collections.ts src/lib/content.ts src/content/covers/generated-covers.json
git commit -m "feat(blog): add cover metadata support"
```

### Task 2: Add Stable Cover Resolution Utilities

**Files:**
- Create: `src/lib/covers.ts`
- Modify: `src/lib/content.ts`
- Test: `npm run build`

- [ ] **Step 1: Create the shared cover-resolution utility**

```ts
import generatedCovers from "@/content/covers/generated-covers.json";

export type CoverInput = {
  cover?: string | null;
  coverAlt?: string | null;
  title: string;
  translationKey: string;
};

export function resolveBlogCover(input: CoverInput) {
  if (input.cover) {
    return {
      src: input.cover,
      alt: input.coverAlt ?? input.title,
      source: "explicit" as const,
    };
  }

  const generated = generatedCovers[input.translationKey];
  if (generated?.src) {
    return {
      src: generated.src,
      alt: input.coverAlt ?? generated.alt ?? input.title,
      source: "generated" as const,
    };
  }

  return {
    src: "",
    alt: input.coverAlt ?? input.title,
    source: "none" as const,
  };
}
```

- [ ] **Step 2: Thread resolved covers through blog list and search payload creation**

```ts
const cover = resolveBlogCover({
  cover: blog.cover,
  coverAlt: blog.coverAlt,
  title: blog.title,
  translationKey,
});

return {
  title: blog.title,
  url: blog.href,
  date: blog.date,
  summary: blog.summary ?? "",
  content: toSearchableContent(blog.content).slice(0, 1200),
  lang: blogLocale,
  translationKey,
  cover,
};
```

- [ ] **Step 3: Ensure bilingual pairs can fall back through shared `translationKey` mappings**

```ts
function getDocumentTranslationKey(document: {
  translationKey?: string | null;
  slug?: string;
}) {
  return document.translationKey ?? document.slug ?? "";
}
```

- [ ] **Step 4: Run build to verify JSON import and type flow**

Run: `npm run build`  
Expected: PASS with no JSON import or type errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/covers.ts src/lib/content.ts
git commit -m "feat(blog): resolve covers from explicit and generated sources"
```

### Task 3: Add the Explicit Cover-Mapping Generator

**Files:**
- Create: `scripts/generate-cover-mapping.mjs`
- Modify: `package.json`
- Modify: `src/content/covers/generated-covers.json`
- Test: `node scripts/generate-cover-mapping.mjs --dry-run`

- [ ] **Step 1: Add a script entry for cover generation**

```json
{
  "scripts": {
    "generate:covers": "node scripts/generate-cover-mapping.mjs"
  }
}
```

- [ ] **Step 2: Create a deterministic generator skeleton**

```js
import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_PATH = path.join(process.cwd(), "src/content/covers/generated-covers.json");

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const current = JSON.parse(await fs.readFile(OUTPUT_PATH, "utf8"));
  console.log(`Loaded ${Object.keys(current).length} existing cover mappings`);

  if (dryRun) {
    console.log("Dry run complete");
    return;
  }

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`Updated ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 3: Add one fetch helper that only resolves posts missing explicit or cached covers**

```js
async function fetchUnsplashCover(query, accessKey) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?per_page=1&orientation=landscape&query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash request failed: ${response.status}`);
  }

  const data = await response.json();
  const item = data.results?.[0];

  return item
    ? {
        src: item.urls?.regular ?? item.urls?.full ?? "",
        alt: item.alt_description ?? query,
      }
    : null;
}
```

- [ ] **Step 4: Verify the generator can run without mutating tracked data**

Run: `node scripts/generate-cover-mapping.mjs --dry-run`  
Expected: PASS with `Dry run complete`

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/generate-cover-mapping.mjs src/content/covers/generated-covers.json
git commit -m "feat(blog): add generated cover mapping workflow"
```

### Task 4: Build a Shared Cover Image Component

**Files:**
- Create: `src/components/blog/blog-cover-image.tsx`
- Modify: `src/app/globals.css`
- Test: `npm run build`

- [ ] **Step 1: Create the reusable cover renderer**

```tsx
import Image from "next/image";

type BlogCoverImageProps = {
  src?: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function BlogCoverImage({ src, alt, priority = false, className }: BlogCoverImageProps) {
  if (!src) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(min-width: 1024px) 900px, 100vw"
      />
    </div>
  );
}
```

- [ ] **Step 2: Add utility classes for image-first card and hero surfaces**

```css
@layer utilities {
  .weekly-surface {
    @apply overflow-hidden rounded-[18px] bg-white;
  }

  .weekly-cover-frame {
    @apply relative overflow-hidden bg-[#d9d9d4];
  }
}
```

- [ ] **Step 3: Run build to verify image usage compiles**

Run: `npm run build`  
Expected: PASS with no `next/image` or CSS-layer errors

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/blog-cover-image.tsx src/app/globals.css
git commit -m "feat(blog): add shared weekly cover image component"
```

### Task 5: Replace the List Feed with Weekly-Style Cards

**Files:**
- Create: `src/components/blog/blog-weekly-card.tsx`
- Modify: `src/components/blog/blog-list.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/en/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/en/blog/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Create the Weekly-style card component**

```tsx
import Link from "next/link";
import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import { formatDateCompact } from "@/lib/utils";

export function BlogWeeklyCard({ blog }: { blog: BlogListItemData }) {
  return (
    <article className="weekly-surface">
      <Link href={blog.href} className="block">
        <BlogCoverImage
          src={blog.cover?.src}
          alt={blog.cover?.alt ?? blog.title}
          priority={false}
          className="weekly-cover-frame aspect-[16/9]"
        />
        <div className="px-5 py-5 md:px-7 md:py-6">
          <p className="text-[14px] text-[rgba(85,85,85,0.75)] md:text-[15px]">
            {formatDateCompact(blog.date, blog.lang)}
          </p>
          <h2 className="mt-3 text-[22px] font-semibold leading-[1.3] text-[#24292f] md:text-[30px]">
            {blog.title}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.75] text-[rgba(85,85,85,0.82)] md:text-[17px]">
            {blog.summary ?? ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 2: Replace the current list row renderer with the new card**

```tsx
export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-6 md:space-y-10">
      {blogs.map((blog) => (
        <BlogWeeklyCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Keep index pages thin and reuse the same list shell**

```tsx
return (
  <div className="mx-auto w-full max-w-[980px] px-4 pb-[15px] pt-3 md:px-5 md:pb-[34px] md:pt-4">
    <BlogList blogs={blogs} />
  </div>
);
```

- [ ] **Step 4: Run build to verify all four list routes render**

Run: `npm run build`  
Expected: PASS with `/`, `/en`, `/blog`, and `/en/blog` generated successfully

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/blog-weekly-card.tsx src/components/blog/blog-list.tsx src/app/page.tsx src/app/en/page.tsx src/app/blog/page.tsx src/app/en/blog/page.tsx
git commit -m "feat(blog): redesign list pages with weekly-style cards"
```

### Task 6: Replace the Article Header with a Weekly Hero

**Files:**
- Create: `src/components/blog/blog-hero.tsx`
- Modify: `src/components/blog/blog-post-page.tsx`
- Modify: `src/app/blog/[...slug]/page.tsx`
- Modify: `src/app/en/blog/[...slug]/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Create the hero component**

```tsx
import { BlogCoverImage } from "@/components/blog/blog-cover-image";

export function BlogHero({ title, summary, date, countLabel, cover }: BlogHeroProps) {
  return (
    <header className="weekly-surface overflow-hidden">
      <BlogCoverImage
        src={cover?.src}
        alt={cover?.alt ?? title}
        priority
        className="weekly-cover-frame aspect-[16/9] md:aspect-[21/9]"
      />
      <div className="px-5 py-5 md:px-8 md:py-7">
        <p className="text-[14px] text-[rgba(85,85,85,0.72)] md:text-[15px]">
          {date} · {countLabel}
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.25] text-[#24292f] md:text-[40px]">
          {title}
        </h1>
        {summary ? (
          <p className="mt-4 max-w-[48rem] text-[17px] leading-[1.75] text-[rgba(85,85,85,0.82)]">
            {summary}
          </p>
        ) : null}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Refactor `BlogPostPage` to use the hero and keep the body single-column**

```tsx
<main className="relative mx-auto max-w-full py-[15px] md:py-[34px]">
  <div className="mx-auto w-full max-w-[980px] px-4 md:px-5">
    <BlogHero
      title={blog.title}
      summary={blog.summary}
      date={blog.date}
      countLabel={countLabel}
      cover={blog.cover}
    />

    <article className="mt-[15px] rounded-[18px] bg-white px-5 py-5 md:mt-[30px] md:px-[56px] md:py-[36px]">
      <div className="mdx-content font-reading-zh [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2">
        <MDXRemote ... />
      </div>
    </article>
  </div>
</main>
```

- [ ] **Step 3: Ensure route loaders pass `summary` and `cover` into the page component**

```ts
<BlogPostPage
  blog={{
    title: blog.title,
    date: blog.date,
    summary: blog.summary ?? "",
    content: blog.content,
    lang: blog.lang,
    cover: blog.cover,
  }}
  locale="zh-CN"
/>
```

- [ ] **Step 4: Run build to verify both Chinese and English detail routes compile**

Run: `npm run build`  
Expected: PASS with all static blog detail pages generated

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/blog-hero.tsx src/components/blog/blog-post-page.tsx src/app/blog/[...slug]/page.tsx src/app/en/blog/[...slug]/page.tsx
git commit -m "feat(blog): redesign article pages with weekly hero layout"
```

### Task 7: Refresh Search Results to Match the Weekly Visual System

**Files:**
- Modify: `src/components/search/search-modal.tsx`
- Modify: `src/lib/content.ts`
- Test: `npm run build`

- [ ] **Step 1: Extend search result typing to accept optional cover metadata**

```ts
type SearchDocument = {
  title: string;
  url: string;
  date: string;
  summary: string;
  content: string;
  lang: "zh-CN" | "en-US";
  translationKey: string;
  cover?: {
    src: string;
    alt: string;
    source: "explicit" | "generated" | "none";
  };
};
```

- [ ] **Step 2: Replace text-only result rows with compact image-aware cards**

```tsx
<Link
  key={`${result.lang}-${result.translationKey}`}
  href={result.url}
  className={`block rounded-[12px] px-3 py-3 transition-colors ${
    selectedIndex === index ? "bg-[#f4f4f1]" : "hover:bg-[#f7f7f4]"
  }`}
>
  <div className="flex gap-3">
    <BlogCoverImage
      src={result.cover?.src}
      alt={result.cover?.alt ?? result.title}
      className="weekly-cover-frame relative hidden aspect-[4/3] w-[120px] shrink-0 rounded-[10px] md:block"
    />
    <div className="min-w-0 flex-1">
      <p className="text-[14px] text-[rgba(85,85,85,0.72)]">{result.date}</p>
      <p className="mt-1 text-[17px] font-semibold leading-[1.4] text-[#24292f]">
        ...
      </p>
      <p className="mt-2 text-[15px] leading-[1.65] text-[rgba(85,85,85,0.8)]">
        ...
      </p>
    </div>
  </div>
</Link>
```

- [ ] **Step 3: Run build to verify search modal still compiles on both locales**

Run: `npm run build`  
Expected: PASS with `/search.json` still generated

- [ ] **Step 4: Commit**

```bash
git add src/components/search/search-modal.tsx src/lib/content.ts
git commit -m "feat(search): align search results with weekly-style cards"
```

### Task 8: Migrate Existing Posts and Generated Covers

**Files:**
- Modify: `src/content/blog/zh/*.md`
- Modify: `src/content/blog/en/*.md`
- Modify: `src/content/covers/generated-covers.json`
- Test: `npm run build`

- [ ] **Step 1: Add explicit `cover` fields for any posts with known manual images**

```md
---
title: "在 Codex 里重新理解 zsh"
date: "2026-03-27"
summary: "同一软件, 一条命令, 两种结果. 让我开始区分 zsh 的不同启动方式."
cover: "/blog/260327_codex-zsh-interactive-shell/image.png"
coverAlt: "Codex terminal screenshot related to zsh startup behavior"
lang: "zh-CN"
translationKey: "codex-zsh"
---
```

- [ ] **Step 2: Populate generated mapping entries for posts that still need fallback covers**

```json
{
  "nextjs-auth-bypass": {
    "src": "https://images.unsplash.com/photo-...",
    "alt": "abstract passage and doorway"
  }
}
```

- [ ] **Step 3: Run build to verify all current posts resolve covers successfully**

Run: `npm run build`  
Expected: PASS with no missing-property errors in list, detail, or search rendering

- [ ] **Step 4: Commit**

```bash
git add src/content/blog/zh src/content/blog/en src/content/covers/generated-covers.json
git commit -m "feat(content): add cover metadata for existing bilingual posts"
```

### Task 9: End-to-End Verification

**Files:**
- Check: `src/app/page.tsx`
- Check: `src/app/en/page.tsx`
- Check: `src/app/blog/page.tsx`
- Check: `src/app/en/blog/page.tsx`
- Check: `src/app/blog/[...slug]/page.tsx`
- Check: `src/app/en/blog/[...slug]/page.tsx`
- Check: `src/components/search/search-modal.tsx`

- [ ] **Step 1: Run the full production build**

Run: `npm run build`  
Expected: PASS with static generation for `/`, `/en`, `/blog`, `/en/blog`, and all blog detail routes

- [ ] **Step 2: Start local preview and visually verify key routes**

Run: `npm run dev`  
Expected: Site serves locally and shows Weekly-style cards on homepage and blog index

- [ ] **Step 3: Manually verify bilingual card/detail behavior**

```text
Check:
1. Chinese homepage card feed uses large cover images.
2. English homepage card feed uses the same cards with English text.
3. Chinese detail page shows hero cover + metadata + centered body.
4. English detail page shows the same structure and shared cover.
```

- [ ] **Step 4: Manually verify search and cover fallback behavior**

```text
Check:
1. Press `/` to open search.
2. Search results show compact image-aware cards.
3. A post with explicit `cover` uses that image.
4. A post without explicit `cover` uses the generated mapping image.
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "test(blog): verify weekly-style redesign flows"
```

## Self-Review

### Spec Coverage

This plan covers all approved requirements:

1. Weekly-style homepage and blog index: Task 5
2. Weekly-style detail hero: Task 6
3. Stable explicit and generated covers: Tasks 1, 2, 3, and 8
4. Shared bilingual cover behavior: Tasks 2 and 8
5. Search preserved but visually updated: Task 7
6. Future life-Weekly boundary preserved by keeping current content structure: Tasks 1 and 2

### Placeholder Scan

Checked for:

1. `TODO`
2. `TBD`
3. “implement later”
4. “add tests for above”

No unresolved placeholders remain in the plan body.

### Type Consistency

The plan uses one consistent cover shape across tasks:

```ts
{
  src: string;
  alt: string;
  source: "explicit" | "generated" | "none";
}
```

`translationKey` remains the shared bilingual lookup key across content, search, and cover resolution tasks.
