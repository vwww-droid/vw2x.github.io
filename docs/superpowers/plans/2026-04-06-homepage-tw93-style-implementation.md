# Homepage tw93 Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the homepage and header to match the approved `tw93.fun`-inspired visual direction while keeping the site structure and content model intact.

**Architecture:** The implementation keeps the current Next.js app structure and content collections, but replaces the global visual foundation, header rendering, and homepage list presentation. The work is intentionally limited to shared config, shared styles, header components, and homepage-facing layouts so the redesign lands without rewriting article detail pages.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 4, content-collections, Framer Motion

---

## File Map

- Modify: `src/lib/config.ts`
  - Add navigation data and a configurable future Weekly URL.
- Modify: `src/app/layout.tsx`
  - Replace the current font loading with the `仓耳今楷` stylesheet source that exposes `TsangerJinKai02`, then set the page shell classes for the new warm-gray background.
- Modify: `src/app/globals.css`
  - Replace the current dark-first token set with a warm editorial palette and shared typography utilities.
- Modify: `src/components/header/index.tsx`
  - Replace the current desktop-only wrapper with a simpler shared header shell.
- Modify: `src/components/header/nav-desktop-menu.tsx`
  - Render the plain-text desktop navigation matching the approved `vw2x / Weekly / GitHub / About` structure.
- Modify: `src/components/header/nav-mobile-menu.tsx`
  - Simplify the mobile navigation so it follows the same information architecture without Radix-heavy styling.
- Modify: `src/app/page.tsx`
  - Replace the current centered hero with a shallow intro band and direct transition into the article list.
- Modify: `src/components/blog/blog-list.tsx`
  - Remove card-like visual grouping and restyle entries as a continuous editorial list.
- Modify: `src/app/blog/page.tsx`
  - Align the standalone blog index page spacing with the new homepage list rhythm.
- Modify: `src/components/site-footer.tsx`
  - Soften footer styling so it no longer clashes with the new editorial shell.

## Task 1: Set the Global Editorial Foundation

**Files:**
- Modify: `src/lib/config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add explicit navigation and Weekly configuration in `src/lib/config.ts`**

Replace the empty `navigation.main` block with explicit links and add the future Weekly URL:

```ts
  social: {
    github: "https://github.com/vwww-droid",
    weekly: "https://weekly.vw2x.com",
    wechatPublic,
  } satisfies {
    github: string;
    weekly: string;
    wechatPublic?: WeChatPublicConfig;
  },
  navigation: {
    main: [
      {
        title: "Weekly",
        href: "https://weekly.vw2x.com",
      },
      {
        title: "GitHub",
        href: "https://github.com/vwww-droid",
      },
      {
        title: "About",
        href: "/about",
      },
    ],
  },
```

- [ ] **Step 2: Run a focused type check by building before style changes**

Run: `npm run build`

Expected: Build passes with the new config shape and no TypeScript errors from `menuItems`.

- [ ] **Step 3: Replace font loading and page shell classes in `src/app/layout.tsx`**

Remove the current `LXGW WenKai Lite` and `Source Sans Pro` setup and switch to the public `仓耳今楷` stylesheet source used by the reference site. The CSS family name remains `TsangerJinKai02`:

```tsx
      <head>
        <link
          rel="stylesheet"
          href="https://tw93.fun/css/jinkai.css?v=20260403152924"
        />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml" />
        <link rel="alternate" type="application/json" title="JSON" href="/feed.json" />
      </head>
      <body className="min-h-dvh overflow-x-hidden bg-background text-foreground antialiased">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col pt-[60px] md:pt-[84px]">{children}</div>
        <SiteFooter />
      </body>
```

- [ ] **Step 4: Replace the global token system in `src/app/globals.css`**

Update the root palette and base typography so the site becomes warm, light, and typography-led:

```css
:root {
  --radius: 0.5rem;
  --background: #e8e8e8;
  --foreground: rgba(36, 41, 47, 0.92);
  --card: #fdfdfc;
  --card-foreground: rgba(36, 41, 47, 0.92);
  --popover: #ffffff;
  --popover-foreground: rgba(36, 41, 47, 0.92);
  --primary: #24292f;
  --primary-foreground: #ffffff;
  --secondary: #f2f2f0;
  --secondary-foreground: rgba(36, 41, 47, 0.9);
  --muted: #efefec;
  --muted-foreground: rgba(36, 41, 47, 0.62);
  --accent: #f3f3f0;
  --accent-foreground: rgba(36, 41, 47, 0.9);
  --border: rgba(36, 41, 47, 0.08);
  --input: rgba(36, 41, 47, 0.08);
  --ring: rgba(36, 41, 47, 0.2);
}

body {
  font-family:
    "TsangerJinKai02",
    "STKaiti",
    "KaiTi",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  letter-spacing: 0.02em;
  line-height: 1.75;
  background: var(--background);
  color: var(--foreground);
}

a {
  color: rgba(36, 41, 47, 0.82);
  transition:
    color 0.18s ease,
    opacity 0.18s ease;
}

a:hover {
  color: rgba(36, 41, 47, 1);
}
```

Also remove the current `.dark` palette block and the old `font-reading-zh` utility so the new font stack is the default instead of an opt-in override.

- [ ] **Step 5: Rebuild to catch token and layout regressions**

Run: `npm run build`

Expected: Build passes and there are no CSS parsing or layout import errors.

- [ ] **Step 6: Commit the foundation changes**

```bash
git add src/lib/config.ts src/app/layout.tsx src/app/globals.css
git commit -m "style: establish tw93-inspired global foundation"
```

## Task 2: Replace the Header With a Plain Editorial Navigation

**Files:**
- Modify: `src/components/header/index.tsx`
- Modify: `src/components/header/nav-desktop-menu.tsx`
- Modify: `src/components/header/nav-mobile-menu.tsx`
- Modify: `src/components/header/nav-data.ts`

- [ ] **Step 1: Update `src/components/header/nav-data.ts` to expose a simple normalized item list**

Keep the file small and explicit:

```ts
import { config } from "@/lib/config";

export type MenuItem = {
  title: string;
  href: string;
  external?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    title: "Weekly",
    href: config.social.weekly,
    external: true,
  },
  {
    title: "GitHub",
    href: config.social.github,
    external: true,
  },
  {
    title: "About",
    href: "/about",
  },
];
```

- [ ] **Step 2: Replace the current animated container in `src/components/header/index.tsx`**

Remove the width animation and render a fixed shell shared by desktop and mobile:

```tsx
import { NavDesktopMenu } from "./nav-desktop-menu";
import { NavMobileMenu } from "./nav-mobile-menu";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[60px] border-b border-black/5 bg-[#fcfcfa]/95 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-[900px] items-center justify-between px-4 md:px-6">
        <NavDesktopMenu />
        <NavMobileMenu />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Rewrite `src/components/header/nav-desktop-menu.tsx` as plain text navigation**

Replace the Radix `NavigationMenu` implementation with a simple `Link` and `a` based layout:

```tsx
import Link from "next/link";
import { menuItems } from "./nav-data";

export function NavDesktopMenu() {
  return (
    <div className="hidden w-full items-center md:flex">
      <Link
        href="/"
        className="mr-8 text-[1.95rem] font-extrabold tracking-tight text-[#24292f]"
      >
        vw2x
      </Link>
      <nav className="flex items-center gap-7 text-[1.1rem] font-semibold text-[#4b5258]">
        {menuItems.map(item =>
          item.external ? (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#24292f]"
            >
              {item.title}
            </a>
          ) : (
            <Link
              key={item.title}
              href={item.href}
              className="transition-colors hover:text-[#24292f]"
            >
              {item.title}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Simplify `src/components/header/nav-mobile-menu.tsx` to match the new information architecture**

Keep the existing `Sheet` dependency, but remove nested collapsibles and button-like visuals:

```tsx
export function NavMobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Link href="/" className="text-[1.8rem] font-extrabold tracking-tight text-[#24292f]">
        vw2x
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#4b5258] hover:bg-transparent">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[260px] border-l-black/5 bg-[#fcfcfa]">
          <nav className="mt-10 flex flex-col gap-5 text-[1.15rem] font-semibold text-[#4b5258]">
            {menuItems.map(item =>
              item.external ? (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-[#24292f]"
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-[#24292f]"
                >
                  {item.title}
                </Link>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

- [ ] **Step 5: Run the build after the header rewrite**

Run: `npm run build`

Expected: Build passes and there are no missing imports from removed Radix navigation helpers.

- [ ] **Step 6: Commit the header work**

```bash
git add src/components/header/index.tsx src/components/header/nav-desktop-menu.tsx src/components/header/nav-mobile-menu.tsx src/components/header/nav-data.ts
git commit -m "feat(homepage): restyle site navigation"
```

## Task 3: Rebuild the Homepage Intro and Editorial Post List

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/blog/blog-list.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/components/site-footer.tsx`

- [ ] **Step 1: Replace the homepage hero in `src/app/page.tsx`**

Switch from the centered display title to a shallow intro band followed by the list:

```tsx
export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 pb-10 pt-5 md:px-6 md:pb-16 md:pt-8">
      <section className="mb-8 rounded-[10px] bg-[#f5f5f1] px-6 py-8 md:mb-10 md:px-8 md:py-10">
        <h1 className="text-[2.3rem] font-bold leading-none tracking-tight text-[#24292f] md:text-[3.2rem]">
          {config.site.title}
        </h1>
        <p className="mt-3 text-sm text-[rgba(36,41,47,0.58)] md:text-base">
          {config.site.tagline}
        </p>
      </section>

      <BlogList blogs={blogs} />
    </main>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/blog/blog-list.tsx` as a flowing editorial list**

Use spacing and text hierarchy instead of article cards:

```tsx
export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      {blogs.map(blog => (
        <BlogListItem key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}

function BlogListItem({ blog }: BlogListItemProps) {
  return (
    <article className="border-b border-black/6 pb-8 last:border-b-0 last:pb-0 md:pb-10">
      <Link href={`/blog/${blog.slug}`} className="block">
        <h2 className="text-[1.85rem] font-semibold leading-[1.35] text-[#2a2f35] transition-colors hover:text-[#111827] md:text-[2.15rem]">
          {blog.title}
        </h2>
        <p className="mt-3 text-sm text-[rgba(36,41,47,0.54)] md:text-base">
          【{blog.date}】{blog.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}
```

Remove the current `word-count` usage and `formatDate` metadata pairing so the homepage reads closer to the reference site's structure.

- [ ] **Step 3: Align the standalone blog index page in `src/app/blog/page.tsx`**

Use the same shell width and spacing as the homepage list page:

```tsx
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 pb-10 pt-5 md:px-6 md:pb-16 md:pt-8">
      <BlogList blogs={blogs} />
    </main>
  );
```

- [ ] **Step 4: Soften the footer in `src/components/site-footer.tsx`**

Make the footer match the warm editorial page instead of the old centered utility look:

```tsx
export function SiteFooter() {
  const github = config.social.github;

  return (
    <footer className="shrink-0 bg-transparent">
      <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-8 text-[0.95rem] text-[rgba(36,41,47,0.5)] md:px-6">
        <Link href="/about" className="transition-colors hover:text-[#24292f]">
          About
        </Link>
        <Separator />
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[#24292f]"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run the full verification pass**

Run: `npm run build`

Expected: Build passes and the production bundle completes successfully.

Then run: `npm run dev`

Expected: Local dev server starts without runtime errors.

Manual checks:

1. Desktop homepage shows a fixed text navigation and a shallow light intro band.
2. The homepage article list no longer renders boxed cards.
3. Mobile navigation opens from the right and exposes `Weekly`, `GitHub`, and `About`.
4. `/blog` still renders the article index with the new list styling.
5. `/about` still remains readable under the new global typography.

- [ ] **Step 6: Commit the homepage restyle**

```bash
git add src/app/page.tsx src/components/blog/blog-list.tsx src/app/blog/page.tsx src/components/site-footer.tsx
git commit -m "feat(homepage): adopt tw93-inspired index layout"
```

## Task 4: Final Regression Sweep

**Files:**
- Modify: none unless regressions are discovered

- [ ] **Step 1: Check for stale imports after the refactor**

Run: `rg -n "word-count|NavigationMenu|NavigationMenuTrigger|ChevronDown|ChevronRight|motion" src`

Expected: Only intentional remaining references are present. Remove stale imports introduced by the redesign.

- [ ] **Step 2: Run the final production build**

Run: `npm run build`

Expected: PASS

- [ ] **Step 3: Capture the final file set**

Run: `git status --short`

Expected: Only the intended homepage redesign files are modified.

- [ ] **Step 4: Commit any cleanup follow-up**

```bash
git add -A
git commit -m "refactor(homepage): clean up redesign leftovers"
```
