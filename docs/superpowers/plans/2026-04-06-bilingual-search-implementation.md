# Bilingual Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bilingual blog/about routes, manual and browser-aware language switching, and a local `search.json`-backed search modal while preserving the current `tw93`-inspired visual direction.

**Architecture:** The implementation keeps the current Next.js App Router and `content-collections` setup, but splits content into explicit `zh/en` trees, adds a small locale helper layer, and renders separate Chinese and English routes. Search stays local: the app exposes a generated `search.json` route and a lightweight client modal that filters results by active language.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, content-collections, Tailwind CSS 4, lucide-react, MDX via `next-mdx-remote-client`

---

## File Map

- Modify: `content-collections.ts`
  - Replace the single blog/about collection shape with language-aware blog and about collections plus shared metadata.
- Create: `src/lib/i18n.ts`
  - Own locale constants, cookie names, browser-language detection helpers, and route translation helpers.
- Create: `src/lib/content.ts`
  - Own language-aware content lookups, sorting, `translationKey` pairing, switch-target lookup, and search document generation.
- Create: `middleware.ts`
  - Apply first-visit locale redirect rules and persist locale choice through request headers/cookies.
- Modify: `src/app/layout.tsx`
  - Read the active locale from request headers and set `html lang`, metadata alternates, and shared search UI shell.
- Modify: `src/lib/config.ts`
  - Add language-aware site metadata strings and shared navigation labels where needed.
- Modify: `src/components/header/index.tsx`
  - Keep the current header shell but add search trigger, locale switch, and language-aware home links.
- Modify: `src/components/header/nav-desktop-menu.tsx`
  - Render the desktop nav with locale-aware links plus search and locale switch controls.
- Modify: `src/components/header/nav-mobile-menu.tsx`
  - Mirror the same controls on mobile.
- Modify: `src/components/header/nav-data.ts`
  - Normalize nav items for locale-aware rendering.
- Create: `src/components/header/language-switch.tsx`
  - Render the `En/中` switch target passed down from the server header.
- Create: `src/components/search/search-provider.tsx`
  - Manage modal open/close state and keyboard shortcuts.
- Create: `src/components/search/search-modal.tsx`
  - Fetch `/search.json`, filter by locale, and render results.
- Create: `src/components/search/search-trigger.tsx`
  - Render the header search icon/button.
- Create: `src/app/set-locale/route.ts`
  - Persist manual locale choice in a cookie and redirect back to the requested page.
- Modify: `src/components/blog/blog-list.tsx`
  - Accept locale-aware hrefs and date formatting behavior.
- Modify: `src/components/giscus-comments.tsx`
  - Pass the active locale to Giscus.
- Modify: `src/app/page.tsx`
  - Render Chinese homepage from Chinese content only.
- Modify: `src/app/blog/page.tsx`
  - Render Chinese blog index from Chinese content only.
- Modify: `src/app/blog/[...slug]/page.tsx`
  - Render Chinese blog detail via shared locale-aware helpers and language alternates.
- Modify: `src/app/about/page.tsx`
  - Render Chinese About content from the new Chinese directory.
- Create: `src/app/en/page.tsx`
  - Render English homepage.
- Create: `src/app/en/blog/page.tsx`
  - Render English blog index.
- Create: `src/app/en/blog/[...slug]/page.tsx`
  - Render English blog detail.
- Create: `src/app/en/about/page.tsx`
  - Render English About page.
- Create: `src/app/search.json/route.ts`
  - Serve combined `zh/en` search documents as JSON.
- Modify: `src/app/sitemap.ts`
  - Emit Chinese and English routes.
- Modify: `scripts/generate-rss.js`
  - Keep feed generation compatible with the new bilingual directory structure.
- Move: `src/content/blog/*.md` -> `src/content/blog/zh/*.md`
- Create: `src/content/blog/en/*.md`
  - Add English translations for all current posts.
- Move: `src/content/about/about.md` -> `src/content/about/zh/about.md`
- Create: `src/content/about/en/about.md`
  - Add translated About content.

## Task 1: Reshape the Content Model Around Explicit Locales

**Files:**
- Modify: `content-collections.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Replace the single collection definition with locale-aware blog and about collections**

Define separate collections for Chinese and English content while keeping one shared schema:

```ts
import { defineCollection, defineConfig } from "@content-collections/core";

const blogSchema = (z: any) => ({
  title: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  featured: z.boolean().optional().default(false),
  summary: z.string(),
  keywords: z.array(z.string()).optional(),
  lang: z.enum(["zh-CN", "en-US"]),
  translationKey: z.string(),
});

const blogsZh = defineCollection({
  name: "blogsZh",
  directory: "src/content/blog/zh",
  include: "**/*.md",
  schema: blogSchema,
  transform: async (document) => ({
    ...document,
    slug: document._meta.path,
    href: `/blog/${document._meta.path}`,
  }),
});

const blogsEn = defineCollection({
  name: "blogsEn",
  directory: "src/content/blog/en",
  include: "**/*.md",
  schema: blogSchema,
  transform: async (document) => ({
    ...document,
    slug: document._meta.path,
    href: `/en/blog/${document._meta.path}`,
  }),
});
```

- [ ] **Step 2: Add locale constants and path helpers in `src/lib/i18n.ts`**

Create one small utility file for locale names, cookie names, and path translation:

```ts
export const DEFAULT_LOCALE = "zh-CN" as const;
export const EN_LOCALE = "en-US" as const;
export const LOCALE_COOKIE = "preferred_locale";

export function isEnglishLocale(value: string | null | undefined) {
  return value?.toLowerCase().startsWith("en") ?? false;
}

export function localeFromPathname(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/")
    ? EN_LOCALE
    : DEFAULT_LOCALE;
}
```

- [ ] **Step 3: Add content lookup helpers in `src/lib/content.ts`**

Create one shared place for sorting, translation matching, and search document assembly:

```ts
import { allBlogsEn, allBlogsZh, allAboutPagesEn, allAboutPagesZh } from "content-collections";
import { DEFAULT_LOCALE, EN_LOCALE } from "./i18n";

export function getBlogsByLocale(locale: string) {
  const source = locale === EN_LOCALE ? allBlogsEn : allBlogsZh;
  return [...source].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogBySlug(locale: string, slug: string) {
  return getBlogsByLocale(locale).find((blog) => blog.slug === slug) ?? null;
}

export function getTranslatedBlog(locale: string, translationKey: string) {
  const opposite = locale === EN_LOCALE ? allBlogsZh : allBlogsEn;
  return opposite.find((blog) => blog.translationKey === translationKey) ?? null;
}

export function getLanguageSwitchTarget(pathname: string) {
  if (pathname === "/" || pathname === "/en") {
    return pathname === "/en"
      ? { redirect: "/", label: "中", locale: DEFAULT_LOCALE }
      : { redirect: "/en", label: "En", locale: EN_LOCALE };
  }

  if (pathname === "/about" || pathname === "/en/about") {
    return pathname === "/en/about"
      ? { redirect: "/about", label: "中", locale: DEFAULT_LOCALE }
      : { redirect: "/en/about", label: "En", locale: EN_LOCALE };
  }

  const locale = pathname.startsWith("/en/") ? EN_LOCALE : DEFAULT_LOCALE;
  const slug = pathname.replace(/^\/en\/blog\//, "").replace(/^\/blog\//, "");
  const current = getBlogBySlug(locale, slug);

  if (!current) {
    return locale === EN_LOCALE
      ? { redirect: "/", label: "中", locale: DEFAULT_LOCALE }
      : { redirect: "/en", label: "En", locale: EN_LOCALE };
  }

  const translated = getTranslatedBlog(locale, current.translationKey);
  if (!translated) {
    return locale === EN_LOCALE
      ? { redirect: "/", label: "中", locale: DEFAULT_LOCALE }
      : { redirect: "/en", label: "En", locale: EN_LOCALE };
  }

  return locale === EN_LOCALE
    ? { redirect: translated.href, label: "中", locale: DEFAULT_LOCALE }
    : { redirect: translated.href, label: "En", locale: EN_LOCALE };
}
```

- [ ] **Step 4: Run a build to verify the new collection names compile**

Run: `npm run build`

Expected: build fails in route files that still import `allBlogs` / `allAboutPages`, but `content-collections.ts` itself compiles and generates the new collection exports successfully.

- [ ] **Step 5: Commit the content model foundation**

```bash
git add content-collections.ts src/lib/i18n.ts src/lib/content.ts
git commit -m "feat(content): add locale-aware content collections"
```

## Task 2: Add Locale Detection, Route Structure, and Shared Page Helpers

**Files:**
- Create: `middleware.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/config.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[...slug]/page.tsx`
- Modify: `src/app/about/page.tsx`
- Create: `src/app/en/page.tsx`
- Create: `src/app/en/blog/page.tsx`
- Create: `src/app/en/blog/[...slug]/page.tsx`
- Create: `src/app/en/about/page.tsx`

- [ ] **Step 1: Create `middleware.ts` for first-visit locale routing**

Apply locale detection only where it is useful, and do not override explicit `/en/...` requests:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, EN_LOCALE, LOCALE_COOKIE, isEnglishLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const explicitLocale = pathname === "/en" || pathname.startsWith("/en/")
    ? EN_LOCALE
    : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", explicitLocale);
  requestHeaders.set("x-current-pathname", pathname);

  if (pathname === "/") {
    const preferred = cookieLocale ?? request.headers.get("accept-language");
    if (!cookieLocale && isEnglishLocale(preferred)) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

- [ ] **Step 2: Read the active locale in `src/app/layout.tsx` and set `html lang`**

Update the root layout to use the middleware header:

```tsx
import { headers } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-site-locale") ?? "zh-CN";

  return (
    <html lang={locale}>
      <head>{/* existing font/feed links */}</head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <Header />
        <div className="flex-1 md:pt-[84px]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Make site metadata strings locale-aware in `src/lib/config.ts`**

Add per-locale descriptions and helper getters:

```ts
  site: {
    title: "vw2x",
    tagline: "As tiny as it is, there is a difference.",
    description: {
      "zh-CN": "记录学习和思考的过程",
      "en-US": "Notes on learning, building, and thinking",
    },
  },
```

- [ ] **Step 4: Refactor root and `/en` pages to render locale-specific content**

Update Chinese routes to call `getBlogsByLocale("zh-CN")` and create English routes that call `getBlogsByLocale("en-US")`:

```tsx
import { BlogList } from "@/components/blog/blog-list";
import { getBlogsByLocale } from "@/lib/content";

export default function Home() {
  const blogs = getBlogsByLocale("zh-CN");
  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-[15px] md:px-5 md:py-[34px]">
      {/* existing motto section */}
      <BlogList blogs={blogs} />
    </div>
  );
}
```

Use the same shape in `src/app/en/page.tsx`, but with English metadata and English blog data.

- [ ] **Step 5: Refactor blog detail routes to use shared locale-aware lookups**

Update both detail route files to:

1. Resolve the blog by locale-specific slug.
2. Compute the translated counterpart from `translationKey`.
3. Set `alternates.languages` metadata.
4. Keep the current article container and TOC behavior.

Use this metadata shape:

```ts
return {
  title: blog.title,
  description: blog.summary,
  alternates: {
    canonical: locale === "en-US" ? `/en/blog/${blog.slug}` : `/blog/${blog.slug}`,
    languages: translated
      ? {
          "zh-CN": `/blog/${locale === "zh-CN" ? blog.slug : translated.slug}`,
          "en-US": `/en/blog/${locale === "en-US" ? blog.slug : translated.slug}`,
        }
      : undefined,
  },
};
```

- [ ] **Step 6: Rebuild to verify route generation and metadata**

Run: `npm run build`

Expected: build passes with static pages for `/`, `/about`, `/blog/*`, `/en`, `/en/about`, and `/en/blog/*`.

- [ ] **Step 7: Commit the locale-aware routing layer**

```bash
git add middleware.ts src/app/layout.tsx src/lib/config.ts src/app/page.tsx src/app/blog/page.tsx src/app/blog/[...slug]/page.tsx src/app/about/page.tsx src/app/en/page.tsx src/app/en/blog/page.tsx src/app/en/blog/[...slug]/page.tsx src/app/en/about/page.tsx
git commit -m "feat(site): add bilingual blog and about routes"
```

## Task 3: Add Search Modal and Language Switching to the Header

**Files:**
- Modify: `src/components/header/index.tsx`
- Modify: `src/components/header/nav-desktop-menu.tsx`
- Modify: `src/components/header/nav-mobile-menu.tsx`
- Modify: `src/components/header/nav-data.ts`
- Create: `src/components/header/language-switch.tsx`
- Create: `src/components/search/search-provider.tsx`
- Create: `src/components/search/search-modal.tsx`
- Create: `src/components/search/search-trigger.tsx`
- Create: `src/app/search.json/route.ts`
- Create: `src/app/set-locale/route.ts`
- Modify: `src/components/giscus-comments.tsx`

- [ ] **Step 1: Expose search documents from `src/app/search.json/route.ts`**

Create a static JSON route backed by the content helper:

```ts
import { NextResponse } from "next/server";
import { getSearchDocuments } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getSearchDocuments());
}
```

- [ ] **Step 2: Add search document generation to `src/lib/content.ts`**

Build compact search records from both locales:

```ts
export function getSearchDocuments() {
  return [...allBlogsZh, ...allBlogsEn].map((blog) => ({
    title: blog.title,
    url: blog.href,
    date: blog.date,
    summary: blog.summary ?? "",
    content: blog.content.replace(/\s+/g, " ").slice(0, 1200),
    lang: blog.lang,
    translationKey: blog.translationKey,
  }));
}
```

- [ ] **Step 3: Create the client search UI**

Implement `search-provider.tsx` and `search-modal.tsx` so the modal behaves like `tw93` without extra animation:

```tsx
"use client";

export function SearchProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <SearchTrigger onOpen={() => setOpen(true)} />
      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}
```

- [ ] **Step 4: Add locale-aware language switching in the header**

Create `src/components/header/language-switch.tsx` as a small render-only component and compute the switch target on the server in `src/components/header/index.tsx` from the current pathname header:

```tsx
import Link from "next/link";

export function LanguageSwitch({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[16px] font-bold text-[rgba(36,41,47,0.82)] transition-colors hover:text-[#24292f]"
    >
      {label}
    </Link>
  );
}
```

In `src/components/header/index.tsx`, read `x-current-pathname` from `headers()`, call `getLanguageSwitchTarget(pathname)`, then convert that into a `/set-locale` link such as `/set-locale?locale=en-US&redirect=/en/blog/...`. The route handler should set `preferred_locale` and redirect back.

- [ ] **Step 5: Create `src/app/set-locale/route.ts` to persist manual locale choice**

Use a tiny redirect route:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, EN_LOCALE, LOCALE_COOKIE } from "@/lib/i18n";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === EN_LOCALE
    ? EN_LOCALE
    : DEFAULT_LOCALE;
  const redirect = request.nextUrl.searchParams.get("redirect") || (locale === EN_LOCALE ? "/en" : "/");

  const response = NextResponse.redirect(new URL(redirect, request.url));
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
```

- [ ] **Step 6: Wire the new controls into desktop and mobile nav**

Update desktop nav to accept `switchHref` and `switchLabel` props, then render:

```tsx
<div className="flex items-center gap-8 text-[16px] font-bold text-[rgba(36,41,47,0.82)]">
  {navItems.map(...)}
  <SearchProvider />
  <LanguageSwitch href={switchHref} label={switchLabel} />
</div>
```

Mirror the same behavior in mobile nav, keeping the search trigger and locale switch visible without introducing a second modal system.

- [ ] **Step 6: Pass active locale to Giscus**
- [ ] **Step 7: Pass active locale to Giscus**

Update `src/components/giscus-comments.tsx`:

```tsx
export default function GiscusComments({ lang }: { lang: "zh-CN" | "en-US" }) {
  return (
    <Giscus
      // existing props
      lang={lang === "en-US" ? "en" : "zh-CN"}
    />
  );
}
```

- [ ] **Step 8: Rebuild and manually smoke-test the header behaviors**

Run: `npm run build`

Expected: build passes.

Then run: `npm run dev`

Manual checks:
1. Clicking the search icon opens the modal.
2. Pressing `/` opens the modal when focus is not inside an input.
3. Pressing `Escape` closes the modal.
4. Clicking `En/中` switches to the correct counterpart page or locale homepage.

- [ ] **Step 9: Commit the header/search interaction layer**

```bash
git add src/components/header/index.tsx src/components/header/nav-desktop-menu.tsx src/components/header/nav-mobile-menu.tsx src/components/header/nav-data.ts src/components/header/language-switch.tsx src/components/search/search-provider.tsx src/components/search/search-modal.tsx src/components/search/search-trigger.tsx src/app/search.json/route.ts src/app/set-locale/route.ts src/components/giscus-comments.tsx src/lib/content.ts
git commit -m "feat(site): add locale switch and local search modal"
```

## Task 4: Move Chinese Content and Add English Translations

**Files:**
- Move: `src/content/blog/20250125_beam-intro.md` -> `src/content/blog/zh/20250125_beam-intro.md`
- Move: `src/content/blog/260314_algorithm-mcp.md` -> `src/content/blog/zh/260314_algorithm-mcp.md`
- Move: `src/content/blog/260319_CVE-2025-29927.md` -> `src/content/blog/zh/260319_CVE-2025-29927.md`
- Move: `src/content/blog/260323_MobileAgentv3.md` -> `src/content/blog/zh/260323_MobileAgentv3.md`
- Move: `src/content/blog/260327_codex-zsh-interactive-shell.md` -> `src/content/blog/zh/260327_codex-zsh-interactive-shell.md`
- Create: `src/content/blog/en/20250125_beam-cross-device-copy-cli.md`
- Create: `src/content/blog/en/20260314_algorithm-assistant-mcp-from-gui-to-api.md`
- Create: `src/content/blog/en/20260319_nextjs-auth-bypass-cases.md`
- Create: `src/content/blog/en/20260323_mobileagent-v3-testing.md`
- Create: `src/content/blog/en/20260327_rethinking-zsh-in-codex.md`
- Move: `src/content/about/about.md` -> `src/content/about/zh/about.md`
- Create: `src/content/about/en/about.md`

- [ ] **Step 1: Move the current Chinese files into `zh` directories and add required metadata**

Each moved Chinese post should gain `lang` and `translationKey`:

```md
---
title: "在 Codex 里重新理解 zsh"
date: "2026-03-27"
featured: false
summary: "同一软件, 一条命令, 两种结果. 让我开始区分 zsh 的不同启动方式."
keywords: ["Codex", "zsh", "Shell", "Debugging", "Android", "Build"]
lang: "zh-CN"
translationKey: "rethinking-zsh-in-codex"
---
```

Use these translation keys:

1. `beam-intro`
2. `algorithm-mcp`
3. `nextjs-auth-bypass-cases`
4. `mobileagent-v3-testing`
5. `rethinking-zsh-in-codex`
6. `about`

- [ ] **Step 2: Create English translations with the same `translationKey` values**

Use close-translation English with cleaned-up wording. Example frontmatter:

```md
---
title: "Rethinking zsh in Codex"
date: "2026-03-27"
featured: false
summary: "Same software, same command, two different outcomes. It pushed me to distinguish how zsh behaves under different startup modes."
keywords: ["Codex", "zsh", "Shell", "Debugging", "Android", "Build"]
lang: "en-US"
translationKey: "rethinking-zsh-in-codex"
---
```

- [ ] **Step 3: Translate `About` into English and add locale metadata**

Create `src/content/about/en/about.md` and update the Chinese file:

```md
---
description: About vw2x
lang: "en-US"
translationKey: "about"
---
```

Also extend the about collection schema in `content-collections.ts` so these fields are typed.

- [ ] **Step 4: Rebuild and spot-check all translated routes**

Run: `npm run build`

Expected: build passes with all Chinese and English content files resolved.

Then run: `npm run dev`

Manual checks:
1. Open `/blog/<zh-slug>` and verify the Chinese content still renders.
2. Open `/en/blog/<en-slug>` and verify the English translation renders.
3. Switch between the two using the header language switch.
4. Open `/about` and `/en/about`.

- [ ] **Step 5: Commit the bilingual content migration**

```bash
git add src/content/blog/zh src/content/blog/en src/content/about/zh src/content/about/en content-collections.ts
git commit -m "feat(content): add English translations for current posts"
```

## Task 5: Finish SEO, Sitemap, Feeds, and Verification

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/generate-rss.js`
- Modify: `src/lib/utils.ts`
- Modify: `src/components/blog/blog-list.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/en/page.tsx`
- Modify: `src/app/en/blog/page.tsx`

- [ ] **Step 1: Update `src/lib/utils.ts` for locale-aware date formatting**

Keep the compact homepage date for Chinese and add a neutral English formatter:

```ts
export function formatDateCompact(date: string, locale: "zh-CN" | "en-US" = "zh-CN") {
  const parsed = new Date(date);

  if (locale === "en-US") {
    return parsed.toISOString().slice(0, 10);
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}
```

- [ ] **Step 2: Update `src/components/blog/blog-list.tsx` to accept locale-specific hrefs and date formatting**

Extend the list item shape:

```ts
export type BlogListItemData = {
  slug: string;
  href: string;
  title: string;
  date: string;
  content: string;
  summary?: string;
  lang: "zh-CN" | "en-US";
};
```

Render links from `blog.href` instead of hardcoding `/blog/${blog.slug}`.

- [ ] **Step 3: Replace the placeholder sitemap with bilingual routes**

Generate sitemap rows from both locale collections:

```ts
import { allBlogsEn, allBlogsZh } from "content-collections";

export default function sitemap() {
  return [
    { url: "/", priority: 1, changeFrequency: "daily" },
    { url: "/en", priority: 1, changeFrequency: "daily" },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" },
    { url: "/en/about", priority: 0.7, changeFrequency: "monthly" },
    ...allBlogsZh.map((blog) => ({
      url: `/blog/${blog.slug}`,
      lastModified: new Date(blog.updated ?? blog.date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allBlogsEn.map((blog) => ({
      url: `/en/blog/${blog.slug}`,
      lastModified: new Date(blog.updated ?? blog.date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
```

- [ ] **Step 4: Make `scripts/generate-rss.js` compatible with `zh/en` content paths**

At minimum:

1. Keep recursive scanning.
2. Respect `lang` from frontmatter.
3. Map Chinese posts to `/blog/...` and English posts to `/en/blog/...`.
4. Replace placeholder site metadata with values from `src/lib/config.ts` or a local constant matching it.

Use this URL shape:

```js
const url =
  data.lang === "en-US"
    ? `${BASE_URL}/en/blog/${slug}`
    : `${BASE_URL}/blog/${slug}`;
```

- [ ] **Step 5: Run final verification**

Run: `npm run build`

Expected: build passes.

Run: `npm run dev`

Manual verification checklist:
1. `GET /` stays Chinese by default.
2. First visit with English preference redirects `/` to `/en`.
3. Clicking `En/中` writes the locale cookie and keeps future visits stable.
4. Search results on Chinese pages contain only Chinese posts.
5. Search results on English pages contain only English posts.
6. `/about` and `/en/about` both render correctly.
7. Blog cards link to the correct locale routes.
8. Giscus language follows the current page locale.

- [ ] **Step 6: Commit the finishing pass**

```bash
git add src/app/sitemap.ts scripts/generate-rss.js src/lib/utils.ts src/components/blog/blog-list.tsx src/app/page.tsx src/app/blog/page.tsx src/app/en/page.tsx src/app/en/blog/page.tsx
git commit -m "feat(site): finish bilingual search rollout"
```
