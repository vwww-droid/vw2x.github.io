# Bilingual Content and Local Search Design

## Context

The site already has a homepage and article detail experience that visually leans toward `tw93.fun`, but it is still a single-language blog with no site search.

The next pass should bring over two structural capabilities from `tw93`:

1. A Chinese and English reading experience with explicit language switching.
2. A local on-site search modal backed by a generated JSON index.

This pass should follow the reference site's architecture closely where that architecture is simple and durable, but it should not pull in a full internationalization framework that exceeds the needs of a static personal blog.

## Goals

1. Add a stable Chinese and English content structure for homepage, about page, and blog posts.
2. Let visitors default into the most appropriate language based on browser language, while respecting manual language switches afterward.
3. Add a search experience similar to `tw93`, including keyboard shortcuts and a modal overlay.
4. Keep authoring simple enough that future posts can be written and translated without inventing a second content system later.

## Non-Goals

1. Do not build machine translation tooling or an admin workflow.
2. Do not split comments by language or create separate comment threads per translation.
3. Do not build Weekly content inside this repository.
4. Do not introduce a heavy app-level i18n dependency when static language routes are sufficient.

## Approved Direction

### Architecture

The site will use explicit bilingual content directories and explicit language-prefixed routes instead of runtime dictionary swapping.

Approved route structure:

1. Chinese homepage: `/`
2. English homepage: `/en`
3. Chinese blog index and detail pages: `/blog/...`
4. English blog index and detail pages: `/en/blog/...`
5. Chinese About page: `/about`
6. English About page: `/en/about`

This mirrors the reference site's core idea: Chinese is the default root experience, English lives under `/en`, and content is translated at the document level rather than injected dynamically into one file.

### Content Organization

Blog content will be split into two directory trees:

1. `src/content/blog/zh`
2. `src/content/blog/en`

About content will also be split into two directory trees:

1. `src/content/about/zh`
2. `src/content/about/en`

Each blog document must include:

1. `title`
2. `date`
3. `summary`
4. `keywords`
5. `lang`
6. `translationKey`

The `translationKey` is the stable mapping key between the Chinese and English versions of the same post. It must be identical across both versions and must not depend on the final route path, so that titles and slugs can evolve independently without breaking language switching.

### Translation Strategy

Existing Chinese posts will receive English versions in this pass.

Approved translation style:

1. Stay close to the original Chinese structure and intent.
2. Allow wording cleanup so the English reads naturally.
3. Do not rewrite articles into materially different essays.
4. Preserve the technical claims, chronology, and conclusions of the original posts.

The same approach applies to `About`: keep the original meaning, improve phrasing where necessary, and avoid turning it into a separate self-introduction.

## Language Selection Behavior

### Default Language

The first visit should choose language in this order:

1. If a language preference cookie exists, use it.
2. Otherwise inspect browser language.
3. If the browser prefers English, route to the English site.
4. Otherwise keep the Chinese default.

This behavior should apply at the homepage entry and should not force-redirect users away from a language-specific URL they explicitly opened.

### Manual Language Switching

The header will include a simple text switch similar to `tw93`:

1. Show `En` while the user is on Chinese pages.
2. Show `中` while the user is on English pages.

Switch behavior rules:

1. On a blog detail page, if a translated counterpart exists for the current `translationKey`, switch directly to that post.
2. If no translated counterpart exists, fall back to the destination language homepage.
3. On homepage and About pages, switch directly to the counterpart route.
4. Persist the chosen language in a cookie so later visits respect manual selection.

## Search Design

### Search Data

Search will be local and static.

The build process should generate a `search.json` payload that includes both Chinese and English blog posts. Each entry should contain:

1. `title`
2. `url`
3. `date`
4. `summary`
5. `content`
6. `lang`
7. `translationKey`

The `content` field should be plain-text searchable content extracted from the article body. It does not need to contain the full article text if a shorter, practical excerpt is more efficient, but it must be good enough for title, summary, and paragraph-level recall.

### Search Interaction

The search experience should follow the reference site's behavior:

1. Header search icon opens a modal.
2. `/` opens search when the user is not typing in another input.
3. `Escape` closes search.
4. Up and down arrow keys move the current selection.
5. `Enter` opens the selected result.

Search should filter results to the current language only. Chinese pages search Chinese entries. English pages search English entries.

### Search Presentation

Each result row should show:

1. Title
2. Summary or excerpt
3. Date

The modal should match the current visual direction:

1. Light content panel
2. Calm border and shadow treatment
3. No flashy animation
4. Consistent typography with the rest of the site

## UI Integration

### Header

The existing top navigation will be extended with:

1. A search trigger icon
2. A language switch entry

The rest of the navigation remains:

1. `vw2x`
2. `Weekly`
3. `GitHub`
4. `About`

Desktop spacing should stay close to the current `tw93`-inspired layout. Mobile behavior should remain simple and readable rather than introducing a complex search-first app shell.

### Homepage and Detail Pages

The current visual direction remains in place:

1. White header
2. Warm-gray page background
3. White content blocks
4. Small single-line motto under the header area

This pass should not replace the current styling direction. It should layer language and search capabilities onto it.

## File and Routing Boundaries

Implementation should create or reshape focused units with clear boundaries:

1. Content collections should own language-aware document metadata.
2. Route files should own language-specific rendering and metadata.
3. A small shared language utility should own route translation, cookie handling, and browser-language decisions.
4. A dedicated search module should own search indexing and modal behavior.

The implementation should avoid burying language logic across unrelated components.

## SEO and Metadata

The bilingual structure should expose correct metadata for each language page.

Requirements:

1. Language-specific page titles and descriptions
2. Correct canonical URLs
3. Alternate links between Chinese and English counterparts where possible
4. `html lang` should reflect the active language

This is especially important because the site is content-driven and the English pages should be discoverable as real counterparts, not as client-side state toggles.

## Error Handling and Fallbacks

1. Missing translation pair: route the language switch to the destination language homepage.
2. Missing cookie or malformed cookie: ignore it and re-evaluate browser language.
3. Search index load failure: keep the modal open and show a quiet failure message.
4. Empty query: show an empty-state prompt instead of stale results.

## Verification

Implementation should be verified with:

1. Local build success
2. Manual check of Chinese homepage, English homepage, Chinese post, English post, Chinese About, and English About
3. Manual check that language switch routes to the counterpart document when available
4. Manual check that `/` opens search and `Escape` closes it
5. Manual check that search results stay within the active language
6. Manual check that a browser with English preference lands on the English homepage when no preference cookie exists

## Risks

1. Translating all existing posts in one pass increases the amount of content editing, which is more error-prone than pure UI work.
2. If route mapping depends on filename rather than `translationKey`, later renames could silently break switching, so the implementation must keep the explicit key.
3. Search indexing may become expensive if full-body content is serialized naively; the index should stay compact.

## Implementation Boundary

This design covers:

1. Bilingual blog content and routes
2. Bilingual About page
3. Browser-aware default language behavior
4. Manual language switching with cookie persistence
5. Local search modal and generated index
6. English translations for current published posts

It does not cover:

1. Weekly subsite content
2. Additional social links
3. Per-language comment separation
4. A generalized localization framework for arbitrary UI modules beyond this blog
