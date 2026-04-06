# Weekly and Notes Subsites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build bilingual `weekly` and `notes` subsites inside the existing repository, seed the first `Weekly` issue, and add project-local drafting and bilingual verification skills.

**Architecture:** Extend the current `content-collections` model with two new content domains and keep all bilingual pairing logic centered on shared `translationKey` and slug rules. Build a dedicated `Weekly` shell that mirrors `tw93/Weekly` at the route and layout level, keep `Notes` lighter with a simpler card and detail flow, and add repo-local automation for draft generation and bilingual completeness checks.

**Tech Stack:** Next.js App Router, `content-collections`, React, TypeScript, local markdown content, repo-local Codex skills, Node scripts

---

## File Structure

### Content collections and helpers

- Modify: `content-collections.ts`
  Add `weekly` and `notes` collections with bilingual metadata and route transforms.
- Modify: `src/lib/content.ts`
  Add normalized getters, pair resolution, search documents, and language-switch support for `weekly` and `notes`.
- Modify: `src/lib/config.ts`
  Add `Weekly` and `Notes` navigation targets where needed.

### Weekly routes and UI

- Create: `src/content/weekly/zh/2615-start-recording.md`
- Create: `src/content/weekly/en/2615-start-recording.md`
- Create: `src/app/weekly/page.tsx`
- Create: `src/app/weekly/[slug]/page.tsx`
- Create: `src/app/en/weekly/page.tsx`
- Create: `src/app/en/weekly/[slug]/page.tsx`
- Create: `src/components/weekly/weekly-card.tsx`
- Create: `src/components/weekly/weekly-grid.tsx`
- Create: `src/components/weekly/weekly-shell.tsx`
- Create: `src/components/weekly/weekly-issue-page.tsx`
- Modify: `src/app/globals.css`
  Add shared `Weekly` shell utilities that are not already present.

### Notes routes and UI

- Create: `src/app/notes/page.tsx`
- Create: `src/app/notes/[slug]/page.tsx`
- Create: `src/app/en/notes/page.tsx`
- Create: `src/app/en/notes/[slug]/page.tsx`
- Create: `src/components/notes/note-card.tsx`
- Create: `src/components/notes/notes-grid.tsx`
- Create: `src/components/notes/note-page.tsx`

### Search, metadata, and verification

- Modify: `src/app/sitemap.ts`
- Modify: `src/components/search/search-modal.tsx`
- Create: `scripts/tests/content-pairs.test.mts`
- Create: `scripts/verify-bilingual-content.mjs`

### Project-local skills

- Create: `.codex/skills/weekly-draft/SKILL.md`
- Create: `.codex/skills/weekly-draft/scripts/create_weekly_draft.mjs`
- Create: `.codex/skills/notes-draft/SKILL.md`
- Create: `.codex/skills/notes-draft/scripts/create_note_draft.mjs`
- Create: `.codex/skills/bilingual-publish-check/SKILL.md`

## Task 1: Extend Content Collections and Shared Content Helpers

**Files:**
- Modify: `content-collections.ts`
- Modify: `src/lib/content.ts`
- Test: `scripts/tests/content-pairs.test.mts`

- [ ] **Step 1: Write the failing content-pair test skeleton**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  getWeeklyIssuesByLocale,
  getNotesByLocale,
  getTranslatedWeeklyIssue,
  getTranslatedNote,
} from "@/lib/content";

test("weekly seed issue has both language variants", () => {
  const zh = getWeeklyIssuesByLocale("zh-CN");
  const en = getWeeklyIssuesByLocale("en-US");

  assert.equal(zh[0]?.translationKey, "2615-start-recording");
  assert.equal(en[0]?.translationKey, "2615-start-recording");
  assert.ok(getTranslatedWeeklyIssue("zh-CN", "2615-start-recording"));
});

test("notes helpers return arrays even before seeded note content exists", () => {
  assert.ok(Array.isArray(getNotesByLocale("zh-CN")));
  assert.equal(getTranslatedNote("zh-CN", "missing-note"), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types scripts/tests/content-pairs.test.mts`
Expected: FAIL because `getWeeklyIssuesByLocale` and `getTranslatedNote` do not exist yet.

- [ ] **Step 3: Extend `content-collections.ts` with `weekly` and `notes`**

```ts
const weekly = defineCollection({
  name: "weekly",
  directory: "src/content/weekly",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    issue: z.number(),
    issueLabel: z.string().optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    const slug = stripLocaleSegment(document._meta.path);
    return {
      ...document,
      slug,
      href: document.lang === "en-US" ? `/en/weekly/${slug}` : `/weekly/${slug}`,
      translationKey: document.translationKey ?? slug,
    };
  },
});

const notes = defineCollection({
  name: "notes",
  directory: "src/content/notes",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    const slug = stripLocaleSegment(document._meta.path);
    return {
      ...document,
      slug,
      href: document.lang === "en-US" ? `/en/notes/${slug}` : `/notes/${slug}`,
      translationKey: document.translationKey ?? slug,
    };
  },
});

export default defineConfig({
  collections: [blogs, aboutPages, weekly, notes],
});
```

- [ ] **Step 4: Extend `src/lib/content.ts` with typed getters**

```ts
import { allAboutPages, allBlogs, allNotes, allWeekly } from "content-collections";

type WeeklyRecord = (typeof allWeekly)[number];
type NoteRecord = (typeof allNotes)[number];

function normalizeWeekly(issue: WeeklyRecord) {
  return {
    ...issue,
    cover: resolveBlogCover({
      title: issue.title,
      translationKey: getDocumentTranslationKey(issue),
      cover: issue.cover,
      coverAlt: issue.coverAlt,
    }),
  };
}

export function getWeeklyIssuesByLocale(locale: Locale) {
  return sortByDateDesc(
    allWeekly.filter((issue) => getDocumentLocale(issue) === locale).map(normalizeWeekly)
  );
}

export function getWeeklyIssueBySlug(locale: Locale, slug: string) {
  return getWeeklyIssuesByLocale(locale).find((issue) => issue.slug === slug) ?? null;
}

export function getTranslatedWeeklyIssue(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getWeeklyIssuesByLocale(oppositeLocale).find(
      (issue) => getDocumentTranslationKey(issue) === translationKey
    ) ?? null
  );
}

export function getNotesByLocale(locale: Locale) {
  return sortByDateDesc(
    allNotes.filter((note) => getDocumentLocale(note) === locale).map(normalizeBlog)
  );
}

export function getTranslatedNote(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getNotesByLocale(oppositeLocale).find(
      (note) => getDocumentTranslationKey(note) === translationKey
    ) ?? null
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test --experimental-strip-types scripts/tests/content-pairs.test.mts`
Expected: PASS after seed content is added in Task 2.

- [ ] **Step 6: Commit**

```bash
git add content-collections.ts src/lib/content.ts scripts/tests/content-pairs.test.mts
git commit -m "feat(content): add weekly and notes content collections"
```

## Task 2: Seed the First Weekly Issue in Both Languages

**Files:**
- Create: `src/content/weekly/zh/2615-start-recording.md`
- Create: `src/content/weekly/en/2615-start-recording.md`
- Test: `scripts/tests/content-pairs.test.mts`

- [ ] **Step 1: Create the Chinese weekly seed issue**

```md
---
title: "2615 - 开始记录"
date: "2026-04-06"
summary: "先把周记入口搭起来，也把这一年的记录方式定下来。"
keywords: ["Weekly", "周记", "记录"]
lang: "zh-CN"
translationKey: "2615-start-recording"
issue: 2615
cover: "/weekly/2615-start-recording/cover.jpg"
coverAlt: "一张用于周记开篇的封面图"
---

这是第一期 `vw2x 周记`。

这里先把结构搭起来：以后每周看到的人、地方、工具和想法，都可以慢慢沉淀到这里。
```

- [ ] **Step 2: Create the English weekly seed issue**

```md
---
title: "2615 - Start Recording"
date: "2026-04-06"
summary: "This opens the weekly journal and sets the tone for how the year will be recorded."
keywords: ["Weekly", "Journal", "Notes"]
lang: "en-US"
translationKey: "2615-start-recording"
issue: 2615
cover: "/weekly/2615-start-recording/cover.jpg"
coverAlt: "Cover image for the first weekly entry"
---

This is the first issue of `vw2x Weekly`.

The goal is simple: turn weekly observations about people, places, tools, and thoughts into something that can accumulate over time.
```

- [ ] **Step 3: Run the content-pair test**

Run: `node --test --experimental-strip-types scripts/tests/content-pairs.test.mts`
Expected: PASS with the bilingual weekly seed pair present.

- [ ] **Step 4: Commit**

```bash
git add src/content/weekly/zh/2615-start-recording.md src/content/weekly/en/2615-start-recording.md scripts/tests/content-pairs.test.mts
git commit -m "feat(weekly): add the first bilingual weekly issue"
```

## Task 3: Build the Weekly Index Page and Card Feed

**Files:**
- Create: `src/components/weekly/weekly-card.tsx`
- Create: `src/components/weekly/weekly-grid.tsx`
- Create: `src/app/weekly/page.tsx`
- Create: `src/app/en/weekly/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create the `WeeklyCard` component**

```tsx
export function WeeklyCard({ issue }: { issue: WeeklyTeaser }) {
  return (
    <Link
      href={issue.href}
      className="card-content mx-auto flex h-full w-full min-w-0 flex-col justify-center overflow-hidden rounded-lg bg-white pb-3 shadow-md"
    >
      <BlogCoverImage
        cover={issue.cover}
        sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="h-56 w-full rounded-t-lg bg-[rgba(246,241,232,0.9)] sm:h-52 md:h-48"
      />
      <div className="flex w-full min-w-0 items-center justify-between gap-3 px-3 pt-3 leading-tight">
        <h2 className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-[rgba(36,41,47,0.96)] md:text-[16px]">
          {issue.title}
        </h2>
        <p className="shrink-0 text-base text-[rgba(85,85,85,0.82)] md:text-[15px]">
          {formatDateWeekly(issue.date)}
        </p>
      </div>
      <p className="line-clamp-2 h-14 w-full overflow-hidden px-3 pt-2 text-base leading-[1.55] text-[rgba(85,85,85,0.86)] md:h-12 md:text-[15px]">
        {issue.summary ?? ""}
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Create the weekly grid and index routes**

```tsx
export function WeeklyGrid({ issues }: { issues: WeeklyTeaser[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 [&>*]:min-w-0 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
      {issues.map((issue, index) => (
        <WeeklyCard key={issue.href} issue={issue} priority={index < 4} />
      ))}
    </div>
  );
}

export default function WeeklyIndexPage() {
  const issues = getWeeklyIssuesByLocale("zh-CN");
  return <WeeklyGrid issues={issues} />;
}
```

- [ ] **Step 3: Add minimal shared weekly utility classes**

```css
.weekly-shell {
  @apply mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8;
}

.weekly-brand {
  font-family:
    "TsangerJinKai02",
    "STKaiti",
    "KaiTi",
    "Songti SC",
    serif;
}
```

- [ ] **Step 4: Verify index routes locally**

Run: `npm run dev`
Expected: `/weekly` and `/en/weekly` render a card grid with the first issue visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/weekly/weekly-card.tsx src/components/weekly/weekly-grid.tsx src/app/weekly/page.tsx src/app/en/weekly/page.tsx src/app/globals.css
git commit -m "feat(weekly): add weekly index pages"
```

## Task 4: Build the Weekly Detail Shell With Left-Side Issue Navigation

**Files:**
- Create: `src/components/weekly/weekly-shell.tsx`
- Create: `src/components/weekly/weekly-issue-page.tsx`
- Create: `src/app/weekly/[slug]/page.tsx`
- Create: `src/app/en/weekly/[slug]/page.tsx`

- [ ] **Step 1: Create the desktop shell with issue navigation**

```tsx
export function WeeklyShell({
  issues,
  currentHref,
  children,
}: {
  issues: WeeklyTeaser[];
  currentHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="weekly-shell grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto pr-4">
          <div className="weekly-brand mb-6 text-[20px] font-semibold">vw2x 周记</div>
          <nav className="space-y-4">
            {issues.map((issue) => (
              <Link
                key={issue.href}
                href={issue.href}
                className={cn(
                  "block text-[18px] text-[rgba(36,41,47,0.92)]",
                  issue.href === currentHref && "text-[#a67c52]"
                )}
              >
                {issue.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create the issue page component**

```tsx
export function WeeklyIssuePage({
  issue,
  locale,
}: {
  issue: WeeklyRecordWithCover;
  locale: Locale;
}) {
  return (
    <article className="space-y-6">
      <header className="space-y-5">
        <h1 className="weekly-brand text-[34px] font-semibold leading-tight md:text-[56px]">
          {issue.title}
        </h1>
        <BlogCoverImage
          cover={issue.cover}
          sizes="(min-width: 1024px) 960px, 100vw"
          className="aspect-[16/9] w-full rounded-[14px] bg-[rgba(246,241,232,0.9)]"
        />
        <p className="text-[18px] leading-[1.75] text-[rgba(36,41,47,0.92)]">
          {issue.summary}
        </p>
      </header>
      <div className={cn("mdx-content", locale === "zh-CN" && "font-reading-zh")}>
        <MDXRemote source={issue.content} components={components} options={options} />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Wire the route pages**

Run: `npm run dev`
Expected: `/weekly/2615-start-recording` and `/en/weekly/2615-start-recording` show left-side issue navigation on desktop and a single-column layout on mobile.

- [ ] **Step 4: Commit**

```bash
git add src/components/weekly/weekly-shell.tsx src/components/weekly/weekly-issue-page.tsx src/app/weekly/[slug]/page.tsx src/app/en/weekly/[slug]/page.tsx
git commit -m "feat(weekly): add weekly issue detail pages"
```

## Task 5: Build Notes Index and Notes Detail Routes

**Files:**
- Create: `src/components/notes/note-card.tsx`
- Create: `src/components/notes/notes-grid.tsx`
- Create: `src/components/notes/note-page.tsx`
- Create: `src/app/notes/page.tsx`
- Create: `src/app/notes/[slug]/page.tsx`
- Create: `src/app/en/notes/page.tsx`
- Create: `src/app/en/notes/[slug]/page.tsx`

- [ ] **Step 1: Create the notes card and grid**

```tsx
export function NoteCard({ note }: { note: NoteTeaser }) {
  return (
    <Link
      href={note.href}
      className="mx-auto flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[12px] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.08)]"
    >
      <h2 className="text-[20px] font-semibold leading-[1.35] text-[rgba(36,41,47,0.96)]">
        {note.title}
      </h2>
      <p className="pt-2 text-[14px] text-[rgba(85,85,85,0.78)]">{formatDateCompact(note.date, note.lang)}</p>
      <p className="pt-3 text-[16px] leading-[1.65] text-[rgba(85,85,85,0.86)]">{note.summary ?? ""}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Create the note detail page**

```tsx
export function NotePage({ note, locale }: { note: NoteRecordWithCover; locale: Locale }) {
  return (
    <article className="mx-auto w-full max-w-[900px] space-y-5 bg-white px-5 py-5 md:px-[30px] md:py-[24px] lg:px-[80px] lg:py-[36px]">
      <header className="space-y-3">
        <h1 className="text-[30px] font-semibold leading-tight text-[rgba(36,41,47,0.96)] md:text-[42px]">
          {note.title}
        </h1>
        <p className="text-[14px] text-[rgba(85,85,85,0.78)]">{formatDateCompact(note.date, locale)}</p>
      </header>
      <div className={cn("mdx-content", locale === "zh-CN" && "font-reading-zh")}>
        <MDXRemote source={note.content} components={components} options={options} />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify notes routes render empty or seeded states safely**

Run: `npm run dev`
Expected: `/notes` and `/en/notes` render a stable page shell even before new note content is added.

- [ ] **Step 4: Commit**

```bash
git add src/components/notes/note-card.tsx src/components/notes/notes-grid.tsx src/components/notes/note-page.tsx src/app/notes/page.tsx src/app/notes/[slug]/page.tsx src/app/en/notes/page.tsx src/app/en/notes/[slug]/page.tsx
git commit -m "feat(notes): add notes index and detail pages"
```

## Task 6: Extend Language Switch, Search, and Metadata for Weekly and Notes

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `src/components/header/nav-data.ts`
- Modify: `src/components/search/search-modal.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Extend route translation in `src/lib/content.ts`**

```ts
if (relativePathname === "/weekly") {
  return { href: nextLocale === EN_LOCALE ? "/en/weekly" : "/weekly", label: getLocaleLabel(nextLocale), locale: nextLocale };
}

const weeklySlug = relativePathname.match(/^\/weekly\/(.+)$/)?.[1];
if (weeklySlug) {
  const current = getWeeklyIssueBySlug(locale, weeklySlug);
  const translated = current
    ? getTranslatedWeeklyIssue(locale, getDocumentTranslationKey(current))
    : null;
  return {
    href: translated?.href ?? getHomeHref(nextLocale),
    label: getLocaleLabel(nextLocale),
    locale: nextLocale,
  };
}
```

- [ ] **Step 2: Add `Weekly` and `Notes` search documents**

```ts
const weeklyDocuments = getWeeklyIssuesByLocale(locale).map((issue) => ({
  title: issue.title,
  url: issue.href,
  date: issue.date,
  summary: issue.summary ?? "",
  content: toSearchableContent(issue.content).slice(0, 1200),
  lang: getDocumentLocale(issue),
  translationKey: getDocumentTranslationKey(issue),
  cover: issue.cover,
}));
```

- [ ] **Step 3: Extend sitemap entries**

Run: `npm run build`
Expected: sitemap includes `/weekly`, `/en/weekly`, `/notes`, `/en/notes`, and seeded issue routes.

- [ ] **Step 4: Commit**

```bash
git add src/lib/content.ts src/components/header/nav-data.ts src/components/search/search-modal.tsx src/app/sitemap.ts
git commit -m "feat(site): wire weekly and notes into routing metadata"
```

## Task 7: Add Project-Local Draft Skills for Weekly and Notes

**Files:**
- Create: `.codex/skills/weekly-draft/SKILL.md`
- Create: `.codex/skills/weekly-draft/scripts/create_weekly_draft.mjs`
- Create: `.codex/skills/notes-draft/SKILL.md`
- Create: `.codex/skills/notes-draft/scripts/create_note_draft.mjs`

- [ ] **Step 1: Create the weekly draft generator script**

```js
#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const [issue, slug, zhTitle, enTitle] = process.argv.slice(2);
const translationKey = slug;

const zhPath = join("src/content/weekly/zh", `${slug}.md`);
const enPath = join("src/content/weekly/en", `${slug}.md`);

const makeDoc = ({ title, lang }) => `---
title: "${title}"
date: "${new Date().toISOString().slice(0, 10)}"
summary: ""
keywords: []
lang: "${lang}"
translationKey: "${translationKey}"
issue: ${issue}
---

`;

await mkdir("src/content/weekly/zh", { recursive: true });
await mkdir("src/content/weekly/en", { recursive: true });
await writeFile(zhPath, makeDoc({ title: zhTitle, lang: "zh-CN" }));
await writeFile(enPath, makeDoc({ title: enTitle, lang: "en-US" }));
```

- [ ] **Step 2: Create concise skill instructions**

```md
---
name: weekly-draft
description: Create a bilingual weekly issue draft in this repository, including matching slug, translationKey, and issue number.
---

Use this when the user wants to start a new `Weekly` issue under `src/content/weekly`.
Run `scripts/create_weekly_draft.mjs` with issue number, slug, Chinese title, and English title.
Then fill the summary and body in both files while keeping structure aligned.
```

- [ ] **Step 3: Repeat the same pattern for notes**

Run: `node .codex/skills/weekly-draft/scripts/create_weekly_draft.mjs 2616 sample-week "2616 - 样例" "2616 - Sample"`
Expected: creates paired draft files under `src/content/weekly/zh` and `src/content/weekly/en`.

- [ ] **Step 4: Commit**

```bash
git add .codex/skills/weekly-draft .codex/skills/notes-draft
git commit -m "feat(skills): add weekly and notes drafting skills"
```

## Task 8: Add Bilingual Publish Verification Workflow and Final Checks

**Files:**
- Create: `scripts/verify-bilingual-content.mjs`
- Create: `.codex/skills/bilingual-publish-check/SKILL.md`
- Test: `scripts/tests/content-pairs.test.mts`

- [ ] **Step 1: Create the verification script**

```js
#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

async function listDocs(base) {
  return (await readdir(base)).filter((file) => file.endsWith(".md")).sort();
}

async function readFrontmatter(path) {
  const source = await readFile(path, "utf8");
  return matter(source).data;
}

async function verifyPair(domain) {
  const zhDir = join("src/content", domain, "zh");
  const enDir = join("src/content", domain, "en");
  const zhFiles = await listDocs(zhDir);
  const enFiles = await listDocs(enDir);
  const missing = zhFiles.filter((file) => !enFiles.includes(file)).map((file) => `${domain}: missing en/${file}`);
  const reverseMissing = enFiles.filter((file) => !zhFiles.includes(file)).map((file) => `${domain}: missing zh/${file}`);
  return [...missing, ...reverseMissing];
}

const errors = [...await verifyPair("weekly"), ...await verifyPair("notes")];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Bilingual weekly/notes verification passed");
```

- [ ] **Step 2: Add the skill wrapper**

```md
---
name: bilingual-publish-check
description: Verify that every weekly and notes entry in this repository has a matching Chinese and English counterpart before push or release.
---

Run `node scripts/verify-bilingual-content.mjs`.
If it fails, fix missing or mismatched bilingual pairs before pushing.
```

- [ ] **Step 3: Run the full verification suite**

Run:

```bash
node --test --experimental-strip-types scripts/tests/content-pairs.test.mts
node scripts/verify-bilingual-content.mjs
npm run lint
npm run build
```

Expected:

1. Tests PASS
2. Verification prints `Bilingual weekly/notes verification passed`
3. Lint PASS
4. Build PASS

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-bilingual-content.mjs .codex/skills/bilingual-publish-check scripts/tests/content-pairs.test.mts
git commit -m "test(content): verify weekly and notes bilingual pairs"
```

## Spec Coverage Check

1. `Weekly` routes and first issue: Tasks 1, 2, 3, 4
2. `Notes` routes and simpler layout: Tasks 1 and 5
3. `Weekly` reference-aligned index/detail split: Tasks 3 and 4
4. Bilingual pairing rules: Tasks 1, 2, 6, 8
5. Drafting skills for `Weekly` and `Notes`: Task 7
6. Push-time bilingual verification workflow: Task 8
7. Search and language-switch integration: Task 6

## Self-Review

1. No unresolved gaps remain in the task body.
2. Route names are consistent across collections, helpers, and route tasks.
3. `translationKey` and slug matching rules are repeated consistently for `weekly` and `notes`.
4. Verification commands cover both author workflow automation and runtime rendering.
