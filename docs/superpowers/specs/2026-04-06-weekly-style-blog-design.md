# Weekly-Style Blog Redesign

## Context

The site already has a bilingual blog, local search, and a homepage/detail experience that visually leans toward `tw93.fun`.

The next redesign is no longer a small visual adjustment. The goal is to rebuild the current blog presentation so it follows the structure and reading feel of `tw93/Weekly` as closely as practical, while keeping the site's existing bilingual routes, content inventory, and search foundation.

The user explicitly allows a large refactor and wants the result to be closer to direct reuse of the reference structure than to a loose visual inspiration.

## Goals

1. Rebuild the homepage and blog index into a `Weekly`-style image-first card feed.
2. Rebuild blog detail pages so the top of each article uses a `Weekly`-style hero treatment with cover media and article metadata.
3. Add stable cover-image support for every post, with manual author-provided images taking priority.
4. Keep the existing bilingual routing, language switch, and local search working after the redesign.
5. Preserve room for a future life-and-travel `Weekly` project without forcing current technical posts to become a separate content type now.

## Non-Goals

1. Do not introduce the future life `Weekly` content domain in this pass.
2. Do not split the repository into separate technical and life publications yet.
3. Do not replace the current bilingual architecture with a new CMS or remote content backend.
4. Do not make image selection random on every build.

## Approved Direction

### Product Positioning

This pass will keep the current content type as `Blog`, but its presentation will adopt the structure and visual rhythm of `tw93/Weekly`.

That means the site will behave as:

1. Technical articles remain technical articles in routing, feeds, and content organization.
2. The homepage and blog listing adopt the `Weekly` card language.
3. Article detail pages adopt the `Weekly` hero-and-reading layout.
4. A future life-and-travel `Weekly` can later become its own content type or subsite without undoing this redesign.

In short: the site will use `Weekly` presentation now without renaming the current technical archive into a true life `Weekly`.

### Reference Strategy

The redesign should follow `tw93/Weekly` closely at the component and layout level where that structure is durable and compatible with the current codebase.

Approved interpretation of “copy the reference”:

1. Reuse the reference information hierarchy and card structure as directly as practical.
2. Keep the current site name, routes, bilingual behavior, and existing content.
3. Avoid adding decorative behavior that the user has already rejected, such as extra motion flourishes.
4. Treat the reference as a layout baseline, not merely a color or typography mood board.

## Content Model

### Blog Metadata

Each blog document will gain cover-image metadata so the redesign has a stable visual source per article.

Required or supported fields after this pass:

1. `title`
2. `date`
3. `updated`
4. `summary`
5. `keywords`
6. `lang`
7. `translationKey`
8. `cover`
9. `coverAlt`

The `cover` field is the primary cover-image source. It may point to:

1. A local asset inside the repository
2. A remote image URL approved for direct rendering
3. A generated fallback mapping produced from the fallback image workflow

The `coverAlt` field should provide a meaningful accessible description when the author supplies one. If omitted, the UI may fall back to the article title.

### Shared Cover Between Languages

Chinese and English versions of the same post should resolve to the same cover by `translationKey`.

That means:

1. The author should not need to configure two separate covers for one bilingual post pair.
2. If a Chinese and English post share a `translationKey`, they should share the same resolved cover image.
3. The rendering layer should prefer explicit per-document `cover` first, then fall back to a shared resolved cover source if needed.

## Cover Image Strategy

### Priority Order

Cover resolution should follow this order:

1. Explicit author-provided `cover` in frontmatter
2. Existing shared cover mapping for the post `translationKey`
3. `Unsplash API` fallback for posts with no explicit cover

This lets the user gradually replace placeholders with self-curated images over time without reworking the system.

### Fallback Behavior

The fallback image workflow must be stable rather than random.

Approved behavior:

1. If a post has no explicit cover, the system may fetch an `Unsplash` image once.
2. The chosen result must be written into a local mapping file keyed by `translationKey`.
3. Later builds must reuse the stored mapping until the author replaces it with an explicit `cover`.
4. The fallback should be optional at render time; the site must still build if the API is unavailable and a cached or explicit image exists.

The implementation should avoid a design where every build can change article covers unexpectedly.

Approved storage location:

1. Store fallback cover mappings at `src/content/covers/generated-covers.json`.
2. Keep the file checked into the repository so cover choices remain stable across machines and deployments.
3. Resolve remote-image allowlisting through the existing image configuration rather than ad hoc component exceptions.

Approved generation timing:

1. Fallback cover generation should run as an explicit content-maintenance step, not as a hidden side effect inside page rendering.
2. The site must be able to build from explicit covers plus the checked-in generated mapping file alone.
3. Missing API credentials must not block local development or production builds if mappings already exist.

### Author Workflow

The intended author workflow after this pass:

1. Write a new post in Chinese and English as usual.
2. If the author has an image, add `cover` directly.
3. If not, let the fallback mapping provide a temporary image.
4. Replace the fallback later with a self-chosen image by editing frontmatter.

This keeps publishing lightweight while still moving the site toward a curated visual archive.

## Page Design

### Homepage and Blog Index

The homepage and `/blog` pages will move from the current text-first white-card list to a `Weekly`-style visual feed.

Required characteristics:

1. Large image-forward cards
2. Clear article title and short excerpt hierarchy
3. Date and metadata placed within the card structure used by the reference layout
4. Consistent card spacing and rhythm across Chinese and English pages
5. A reading experience that feels like browsing issues or visual notes, not a plain article inventory

The homepage and `/blog` can share the same list component, with homepage simply showing the same feed within the current site shell.

### Article Detail Page

Article detail pages will adopt a `Weekly`-style top section:

1. Large cover image at the top of the post
2. Title and article metadata integrated with the hero region
3. Reading body below in a single centered column
4. Body typography still optimized for long-form technical reading rather than magazine-style fragmentation

The detail page should feel like the same publication system as the listing page, not like a different site after click-through.

### Search Presentation

The existing local search should remain functionally intact, but the result presentation should align more closely with the new `Weekly` list style.

Approved direction:

1. Keep the current search architecture and keyboard behavior
2. Refresh search result item styling so it visually belongs to the new card-first publication system
3. Do not rebuild search into a new external service

## Routing and Architecture

### Content Structure

The site should keep the current bilingual content structure:

1. `src/content/blog/zh`
2. `src/content/blog/en`

The redesign must not replace this architecture with a separate `weekly` content tree yet.

### Reusable Units

Implementation should separate concerns into focused units:

1. Content-layer cover resolution and metadata normalization
2. Shared image-first blog list components
3. Shared article hero component for detail pages
4. Fallback cover mapping utility and generation workflow
5. Search-result presentation updates

This avoids burying image logic inside route files or scattering fallback behavior across unrelated components.

## Future Weekly Boundary

The user plans to create a future non-technical `Weekly` focused on life, places visited, and interesting things encountered.

This redesign must leave room for that future direction without prematurely mixing content domains.

Required boundary:

1. Current technical posts keep living under the existing blog content system.
2. The new visual system should be reusable later for a life `Weekly`.
3. The current pass should not hardcode naming or assumptions that make a future second publication awkward.

This means the code should favor reusable publication components rather than tightly coupling everything to technical blog semantics.

## Error Handling and Fallbacks

1. Missing explicit cover with valid cached fallback: render cached fallback.
2. Missing explicit cover and no cached fallback while fallback fetch succeeds: store and render the fetched result.
3. Fallback fetch failure with no available image: render a graceful no-image variant instead of failing the page.
4. Missing `coverAlt`: fall back to the article title for accessibility.

## Verification

Implementation should be verified with:

1. Local build success
2. Manual check of homepage and `/blog` in Chinese and English
3. Manual check of at least one Chinese and one English detail page with hero cover rendering
4. Manual check that explicit covers override fallback covers
5. Manual check that a post pair sharing `translationKey` resolves to the same cover across languages
6. Manual check that search still works and visually fits the redesigned publication style
