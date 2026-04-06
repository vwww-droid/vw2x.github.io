# Weekly Style Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the blog post comment area so it matches the `tw93/Weekly` Giscus experience, including custom iframe themes, bottom-position input, and light/dark theme synchronization.

**Architecture:** Keep the existing `@giscus/react` integration and add a small pure helper module that owns theme-path, locale, and document-mode decisions. The React comment component will use that helper, host two public Giscus theme CSS files, and sync iframe theme updates via `postMessage`. The article page shell remains unchanged except for the immediate comment card spacing.

**Tech Stack:** Next.js 15, React 19, TypeScript, `@giscus/react`, Node 24 built-in test runner, static CSS under `public/styles`

---

### Task 1: Add A Testable Giscus Theme Helper

**Files:**
- Create: `src/components/giscus-comments-theme.ts`
- Create: `scripts/tests/giscus-comments-theme.test.mts`

- [ ] **Step 1: Write the failing test**

Create `scripts/tests/giscus-comments-theme.test.mts` with:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  GISCUS_DARK_THEME_PATH,
  GISCUS_LIGHT_THEME_PATH,
  getDocumentModeFromClassName,
  getGiscusLang,
  getGiscusThemeMessage,
  getGiscusThemeUrl,
} from "../../src/components/giscus-comments-theme.ts";

test("uses dark mode when the root class contains dark", () => {
  assert.equal(getDocumentModeFromClassName("dark"), "dark");
  assert.equal(getDocumentModeFromClassName("site dark reading"), "dark");
});

test("falls back to light mode when dark is absent", () => {
  assert.equal(getDocumentModeFromClassName(""), "light");
  assert.equal(getDocumentModeFromClassName("site reading"), "light");
});

test("maps locale to the giscus language code", () => {
  assert.equal(getGiscusLang("zh-CN"), "zh-CN");
  assert.equal(getGiscusLang("en-US"), "en");
});

test("builds absolute theme urls from the current origin", () => {
  assert.equal(
    getGiscusThemeUrl("https://vw2x.vercel.app", "light"),
    "https://vw2x.vercel.app/styles/giscus-light.css"
  );
  assert.equal(
    getGiscusThemeUrl("https://vw2x.vercel.app", "dark"),
    "https://vw2x.vercel.app/styles/giscus-dark.css"
  );
  assert.equal(GISCUS_LIGHT_THEME_PATH, "/styles/giscus-light.css");
  assert.equal(GISCUS_DARK_THEME_PATH, "/styles/giscus-dark.css");
});

test("builds the postMessage payload expected by giscus", () => {
  assert.deepEqual(
    getGiscusThemeMessage("https://vw2x.vercel.app/styles/giscus-dark.css"),
    {
      giscus: {
        setConfig: {
          theme: "https://vw2x.vercel.app/styles/giscus-dark.css",
        },
      },
    }
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
```

Expected: FAIL with a module resolution error because `src/components/giscus-comments-theme.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/giscus-comments-theme.ts` with:

```ts
export const GISCUS_LIGHT_THEME_PATH = "/styles/giscus-light.css";
export const GISCUS_DARK_THEME_PATH = "/styles/giscus-dark.css";

export type GiscusDocumentMode = "light" | "dark";
export type GiscusLocale = "zh-CN" | "en-US";

export function getDocumentModeFromClassName(
  className: string
): GiscusDocumentMode {
  return className.split(/\s+/).includes("dark") ? "dark" : "light";
}

export function getGiscusLang(locale: GiscusLocale) {
  return locale === "en-US" ? "en" : "zh-CN";
}

export function getGiscusThemeUrl(
  origin: string,
  mode: GiscusDocumentMode
) {
  const themePath =
    mode === "dark" ? GISCUS_DARK_THEME_PATH : GISCUS_LIGHT_THEME_PATH;

  return `${origin}${themePath}`;
}

export function getGiscusThemeMessage(theme: string) {
  return {
    giscus: {
      setConfig: {
        theme,
      },
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
```

Expected: PASS with 5 passing tests and no runtime warnings.

- [ ] **Step 5: Commit**

```bash
git add src/components/giscus-comments-theme.ts scripts/tests/giscus-comments-theme.test.mts
git commit -m "test(comments): add giscus theme helper coverage"
```

### Task 2: Rebuild The Giscus Component With Weekly-Style Themes

**Files:**
- Create: `public/styles/giscus-light.css`
- Create: `public/styles/giscus-dark.css`
- Modify: `src/components/giscus-comments.tsx`
- Modify: `scripts/tests/giscus-comments-theme.test.mts`

- [ ] **Step 1: Write the failing test**

Extend `scripts/tests/giscus-comments-theme.test.mts` with one more test:

```ts
test("keeps helper outputs stable for the component integration contract", () => {
  const darkTheme = getGiscusThemeUrl("https://vw2x.vercel.app", "dark");
  const message = getGiscusThemeMessage(darkTheme);

  assert.equal(darkTheme.endsWith(GISCUS_DARK_THEME_PATH), true);
  assert.equal(getGiscusLang("en-US"), "en");
  assert.deepEqual(message.giscus.setConfig, { theme: darkTheme });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
```

Expected: FAIL because `message.giscus.setConfig` is not yet asserted anywhere and the helper contract will need to remain stable while the component is refactored. If the test passes immediately, tighten the assertion so it checks the exact dark-theme URL returned from the helper before proceeding.

- [ ] **Step 3: Write minimal implementation**

Create `public/styles/giscus-light.css` with:

```css
@import url("https://tw93.fun/css/jinkai.css?v=20260403152924");

main {
  --color-btn-text: #24292f;
  --color-btn-bg: #f6f8fa;
  --color-btn-border: rgb(27 31 36 / 15%);
  --color-btn-shadow: 0 1px 0 rgb(27 31 36 / 4%);
  --color-btn-inset-shadow: inset 0 1px 0 rgb(255 255 255 / 25%);
  --color-btn-hover-bg: #f3f4f6;
  --color-btn-hover-border: rgb(27 31 36 / 15%);
  --color-btn-active-bg: hsl(220deg 14% 93% / 100%);
  --color-btn-active-border: rgb(27 31 36 / 15%);
  --color-btn-selected-bg: hsl(220deg 14% 94% / 100%);
  --color-btn-primary-text: #fff;
  --color-btn-primary-bg: #a67c52;
  --color-btn-primary-border: rgb(27 31 36 / 15%);
  --color-btn-primary-shadow: 0 1px 0 rgb(27 31 36 / 10%);
  --color-btn-primary-inset-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  --color-btn-primary-hover-bg: #a67c52;
  --color-btn-primary-hover-border: rgb(27 31 36 / 15%);
  --color-btn-primary-selected-bg: hsl(137deg 55% 36% / 100%);
  --color-btn-primary-selected-shadow: inset 0 1px 0 rgb(0 45 17 / 20%);
  --color-btn-primary-disabled-text: rgb(255 255 255 / 80%);
  --color-btn-primary-disabled-bg: #c0b5ac;
  --color-btn-primary-disabled-border: rgb(27 31 36 / 15%);
  --color-fg-default: #24292f;
  --color-fg-muted: #57606a;
  --color-fg-subtle: #6e7781;
  --color-canvas-default: #fff;
  --color-canvas-overlay: #fff;
  --color-canvas-inset: #fff;
  --color-canvas-subtle: #fff;
  --color-border-default: #eee;
  --color-border-muted: #eee;
  --color-neutral-muted: rgb(175 184 193 / 20%);
  --color-accent-fg: #a67c52;
  --color-accent-emphasis: #eee;
  --color-accent-muted: #eee;
  --color-accent-subtle: #fff;
  --color-success-fg: #1a7f37;
  --color-attention-fg: #9a6700;
  --color-danger-fg: #cf222e;
  --color-danger-muted: rgb(255 129 130 / 40%);
  --color-danger-subtle: #ffebe9;
  --color-primer-shadow-inset: inset 0 1px 0 rgb(208 215 222 / 20%);
  --color-primer-shadow-focus: 0 0 0 3px rgb(9 105 218 / 30%);
  --color-scale-gray-1: #eaeef2;
  --color-scale-blue-1: #eee;
  --color-social-reaction-bg-hover: var(--color-scale-gray-1);
  --color-social-reaction-bg-reacted-hover: var(--color-scale-blue-1);
  color-scheme: light;
}

html {
  font-size: 16px;
}

main {
  font-family:
    "TsangerJinKai02",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji";
  letter-spacing: 0.5px;
}

main .pagination-loader-container {
  background-image: url("https://gw.alipayobjects.com/zos/k/7c/progressive-disclosure-line.svg");
}

main .gsc-loading-image {
  background-image: url("https://gw.alipayobjects.com/zos/k/xi/mona-loading-default.gif");
}

main .gsc-left-header .color-text-secondary,
.gsc-header {
  display: none;
}

main .gsc-comment-box-textarea {
  border-color: var(--color-border-default);
}

.form-control {
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 14px;
}

main .gsc-comment-box-textarea:focus,
#__next .form-control:focus {
  outline: 0;
  box-shadow: none;
}

.btn-primary,
.btn.ml-1.rounded-md.border {
  box-shadow: none;
  border: none;
}

.gsc-tl-line {
  width: 1px;
}

.gsc-comment {
  font-size: 14px;
  line-height: 1.7;
}

.gsc-comment-content {
  font-size: 16px;
}

.gsc-reactions-count {
  visibility: hidden;
}

.gsc-reactions-count:after {
  content: "欢迎一起交流~";
  visibility: visible;
  font-size: 22px;
  display: inline-block;
  margin-bottom: 16px;
  margin-left: -64px;
}

html[lang="en"] .gsc-reactions-count:after {
  content: "Feel free to discuss~";
}

.gsc-reply-content {
  padding-top: 13px;
  padding-bottom: 13px;
}

#__next .rounded-md {
  border-radius: 4px;
}

textarea:focus,
input:focus {
  outline: none;
}

.gsc-social-reaction-summary-item {
  font-size: 14px;
  border-radius: 8px;
  line-height: 26px;
  padding-inline-end: 6px;
  padding-inline-start: 6px;
}

.link-secondary.overflow-hidden.text-ellipsis {
  text-decoration-line: none;
  word-spacing: -2px;
}
```

Create `public/styles/giscus-dark.css` with:

```css
@import url("https://tw93.fun/css/jinkai.css?v=20260403152924");

main {
  --color-btn-text: #e7e9ea;
  --color-btn-bg: #2c5558;
  --color-btn-border: rgb(231 233 234 / 15%);
  --color-btn-shadow: 0 1px 0 rgb(231 233 234 / 4%);
  --color-btn-inset-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
  --color-btn-hover-bg: #353b42;
  --color-btn-hover-border: rgb(231 233 234 / 15%);
  --color-btn-active-bg: hsl(210deg 10% 23% / 100%);
  --color-btn-active-border: rgb(231 233 234 / 15%);
  --color-btn-selected-bg: hsl(210deg 10% 22% / 100%);
  --color-btn-primary-text: #e7e9ea;
  --color-btn-primary-bg: #e8a15a;
  --color-btn-primary-border: rgb(231 233 234 / 15%);
  --color-btn-primary-shadow: 0 1px 0 rgb(231 233 234 / 10%);
  --color-btn-primary-inset-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  --color-btn-primary-hover-bg: #e8a15a;
  --color-btn-primary-hover-border: rgb(231 233 234 / 15%);
  --color-btn-primary-selected-bg: hsl(33deg 40% 50% / 100%);
  --color-btn-primary-selected-shadow: inset 0 1px 0 rgb(165 120 79 / 20%);
  --color-btn-primary-disabled-text: rgba(199, 205, 210, 0.8);
  --color-btn-primary-disabled-bg: #5c5248;
  --color-btn-primary-disabled-border: rgb(231 233 234 / 15%);
  --color-fg-default: #e7e9ea;
  --color-fg-muted: #a9aeb3;
  --color-fg-subtle: #8b949e;
  --color-canvas-default: #21262b;
  --color-canvas-overlay: #21262b;
  --color-canvas-inset: #21262b;
  --color-canvas-subtle: #21262b;
  --color-border-default: #555;
  --color-border-muted: #555;
  --color-neutral-muted: rgb(110 118 129 / 40%);
  --color-accent-fg: #e8a15a;
  --color-accent-emphasis: #555;
  --color-accent-muted: #555;
  --color-accent-subtle: #2c5558;
  --color-success-fg: #3fb950;
  --color-attention-fg: #d29922;
  --color-danger-fg: #f85149;
  --color-danger-muted: rgb(248 81 73 / 40%);
  --color-danger-subtle: #3d1d1d;
  --color-primer-shadow-inset: inset 0 1px 0 rgb(51 51 51 / 20%);
  --color-primer-shadow-focus: 0 0 0 3px rgb(162 120 79 / 30%);
  --color-scale-gray-1: #2c5558;
  --color-scale-blue-1: #555;
  --color-social-reaction-bg-hover: var(--color-scale-gray-1);
  --color-social-reaction-bg-reacted-hover: var(--color-scale-blue-1);
  color-scheme: dark;
}

html {
  font-size: 16px;
}

main {
  font-family:
    "TsangerJinKai02",
    "STKaiti",
    "KaiTi",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji";
  letter-spacing: 0.5px;
}

main .pagination-loader-container {
  background-image: url("https://gw.alipayobjects.com/zos/k/7c/progressive-disclosure-line.svg");
}

main .gsc-loading-image {
  background-image: url("https://gw.alipayobjects.com/zos/k/xi/mona-loading-default.gif");
}

main .gsc-left-header .color-text-secondary,
.gsc-header {
  display: none;
}

main .gsc-comment-box-textarea {
  border-color: var(--color-border-default);
}

.form-control {
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 14px;
}

main .gsc-comment-box-textarea:focus,
#__next .form-control:focus {
  outline: 0;
  box-shadow: none;
}

.btn-primary,
.btn.ml-1.rounded-md.border {
  box-shadow: none;
  border: none;
}

.gsc-tl-line {
  width: 1px;
}

.gsc-comment {
  font-size: 14px;
  line-height: 1.7;
}

.gsc-comment-content {
  font-size: 16px;
}

.gsc-reactions-count {
  visibility: hidden;
}

.gsc-reactions-count:after {
  content: "欢迎一起交流~";
  visibility: visible;
  font-size: 22px;
  display: inline-block;
  margin-bottom: 16px;
  margin-left: -64px;
}

html[lang="en"] .gsc-reactions-count:after {
  content: "Feel free to discuss~";
}

.gsc-reply-content {
  padding-top: 13px;
  padding-bottom: 13px;
}

#__next .rounded-md {
  border-radius: 4px;
}

textarea:focus,
input:focus {
  outline: none;
}

.gsc-social-reaction-summary-item {
  font-size: 14px;
  border-radius: 8px;
  line-height: 26px;
  padding-inline-end: 6px;
  padding-inline-start: 6px;
}

.link-secondary.overflow-hidden.text-ellipsis {
  text-decoration-line: none;
  word-spacing: -2px;
}
```

Replace `src/components/giscus-comments.tsx` with:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Giscus from "@giscus/react";

import { config } from "@/lib/config";
import {
  getDocumentModeFromClassName,
  getGiscusLang,
  getGiscusThemeMessage,
  getGiscusThemeUrl,
  type GiscusDocumentMode,
} from "@/components/giscus-comments-theme";

export default function GiscusComments({
  lang = "zh-CN",
}: {
  lang?: "zh-CN" | "en-US";
}) {
  const { repo, repoId, category, categoryId } = config.giscus;
  const [mode, setMode] = useState<GiscusDocumentMode>("light");

  const theme = useMemo(() => {
    if (typeof window === "undefined") {
      return getGiscusThemeUrl(config.site.url, mode);
    }

    return getGiscusThemeUrl(window.location.origin, mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    const syncMode = () => {
      setMode(getDocumentModeFromClassName(root.className));
    };

    syncMode();

    const observer = new MutationObserver(syncMode);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(getGiscusThemeMessage(theme), "https://giscus.app");
  }, [theme]);

  if (!categoryId) {
    return null;
  }

  return (
    <div className="weekly-giscus-shell mt-0">
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme}
        lang={getGiscusLang(lang)}
        loading="lazy"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests and build to verify they pass**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
npm run build
```

Expected:

1. The Node test suite passes.
2. `next build` completes successfully.

- [ ] **Step 5: Commit**

```bash
git add public/styles/giscus-light.css public/styles/giscus-dark.css src/components/giscus-comments.tsx scripts/tests/giscus-comments-theme.test.mts
git commit -m "feat(comments): adopt weekly style giscus themes"
```

### Task 3: Align The Comment Card Spacing With Weekly

**Files:**
- Modify: `src/components/blog/blog-post-page.tsx`
- Test: `scripts/tests/giscus-comments-theme.test.mts`

- [ ] **Step 1: Re-run the existing test suite as the guardrail before changing layout**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
```

Expected: PASS. This confirms the helper and component contract are still stable before visual-only spacing adjustments.

- [ ] **Step 2: Write minimal implementation**

Update `src/components/blog/blog-post-page.tsx` so the comment surface is visually closer to Weekly:

```tsx
import { MDXRemote } from "next-mdx-remote-client/rsc";
import count from "word-count";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

import { BlogHero } from "@/components/blog/blog-hero";
import { components } from "@/components/mdx-components";
import GiscusComments from "@/components/giscus-comments";
import type { BlogCover } from "@/lib/covers";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";
import { cn } from "@/lib/utils";

type BlogPostPageProps = {
  blog: {
    title: string;
    date: string;
    summary?: string;
    content: string;
    cover: BlogCover;
  };
  locale: "zh-CN" | "en-US";
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

const pageShellClassName = "mx-auto w-full max-w-[900px] px-4 md:px-5";
const articleSurfaceClassName =
  "bg-[rgba(255,255,255,0.9)] px-5 py-5 md:px-[30px] md:py-[24px] lg:px-[80px] lg:py-[36px]";
const commentsSurfaceClassName =
  "bg-white px-[15px] py-5 md:rounded-[8px] md:px-[30px] md:py-5 lg:px-[80px] lg:py-[50px]";

export function BlogPostPage({ blog, locale }: BlogPostPageProps) {
  const metaLabel =
    locale === "en-US" ? `${count(blog.content)} words` : `${count(blog.content)} 字`;

  return (
    <main className="relative mx-auto max-w-full py-[15px] md:py-[34px]">
      <div className="space-y-[15px] md:space-y-[30px]">
        <BlogHero
          title={blog.title}
          date={blog.date}
          summary={blog.summary}
          metaLabel={metaLabel}
          cover={blog.cover}
          locale={locale}
          className={pageShellClassName}
        />

        <div className={pageShellClassName}>
          <article className={articleSurfaceClassName}>
            <div
              className={cn(
                "mdx-content [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2",
                locale === "zh-CN" && "font-reading-zh"
              )}
            >
              <MDXRemote
                source={expandMultiBlankLines(blog.content)}
                components={components}
                options={options}
              />
            </div>
          </article>
        </div>

        <div className={pageShellClassName}>
          <section className={commentsSurfaceClassName} aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="sr-only">
              Comments
            </h2>
            <GiscusComments lang={locale} />
          </section>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run build to verify the page still compiles**

Run:

```bash
npm run build
```

Expected: PASS with no type or bundling errors.

- [ ] **Step 4: Manual browser verification**

Run:

```bash
npm run dev
```

Then open one Chinese blog post and verify:

1. The comment card padding matches the Weekly feel on desktop and mobile widths.
2. The Giscus input box is at the bottom.
3. The `欢迎一起交流~` heading appears.
4. Switching the root `html` class between `""` and `"dark"` in DevTools updates the iframe theme.
5. English posts still render `Feel free to discuss~`.

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/blog-post-page.tsx
git commit -m "feat(blog): align comment card with weekly style"
```

### Task 4: Final Verification And Cleanup

**Files:**
- Modify: none
- Test: `scripts/tests/giscus-comments-theme.test.mts`

- [ ] **Step 1: Run the final verification suite**

Run:

```bash
node --test --experimental-strip-types scripts/tests/giscus-comments-theme.test.mts
npm run build
git status --short
```

Expected:

1. Tests pass.
2. Build passes.
3. `git status --short` shows only the intended tracked changes or a clean tree if everything is already committed.

- [ ] **Step 2: Record the visual verification outcome in the working notes or PR description**

Use this exact checklist in the commit or PR notes:

```md
Manual verification:
1. Chinese post comment card matches Weekly spacing.
2. English post uses the English reaction prompt.
3. Giscus input is at the bottom.
4. Dark root class switches iframe theme.
5. Build passes locally.
```

- [ ] **Step 3: Commit if anything changed during verification**

```bash
git add -A
git commit -m "chore(comments): finalize weekly style verification"
```

Skip this commit if the verification step did not change any files.
