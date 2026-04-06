# Weekly and Notes Subsites Design

## Context

The repository already has a bilingual `blog` and `about` system built on local markdown content, `translationKey` pairing, language-prefixed routes, and a shared publication UI.

The next step is no longer a visual tweak to the existing blog. The site now needs two additional publication domains that remain inside the same repository and reuse the same bilingual content foundation:

1. `Weekly`, which is a recurring personal weekly journal and should follow the structure of `tw93/Weekly` as closely as practical.
2. `Notes`, which is a lighter stream of short-form personal records that can be published at any time without the cadence and structure of a weekly issue.

The user explicitly wants:

1. `Weekly` to live under a site route prefix instead of a separate app for now.
2. The `Weekly` homepage and detail experience to follow the `tw93/Weekly` reference shape.
3. Both `Weekly` and `Notes` to be bilingual from the start.
4. Project-local skills to help draft `Weekly` and `Notes` content.
5. A push-time or pre-push verification workflow that checks whether every published item has a matching Chinese and English counterpart.

## Goals

1. Add a bilingual `Weekly` publication domain under `/weekly` and `/en/weekly`.
2. Add a bilingual `Notes` publication domain under `/notes` and `/en/notes`.
3. Reuse the repository's existing markdown-first content workflow, bilingual pairing model, and shared UI foundation instead of creating a separate app.
4. Make the `Weekly` homepage and detail layout follow the `tw93/Weekly` structure closely, with route differences only where required by the new `/weekly` prefix.
5. Keep `Notes` visually related to the rest of the site, but distinct from `Weekly` in information architecture and reading expectations.
6. Create project-local skills for drafting new `Weekly` and `Notes` entries.
7. Add a project-local bilingual verification workflow that blocks incomplete Chinese/English content pairs before push or release.
8. Seed the new `Weekly` domain with one real bilingual first issue:
   - Chinese: `2615 - 开始记录`
   - English: `2615 - Start Recording`
   - Shared slug: `2615-start-recording`

## Non-Goals

1. Do not split the repository into multiple deployable applications in this pass.
2. Do not merge `Weekly` and `Notes` back into the existing `blog` routes.
3. Do not redesign the existing technical `blog` domain into a `Weekly` or `Notes` experience.
4. Do not build automatic machine translation at publish time without explicit author review.
5. Do not introduce a CMS, database, or remote authoring system.
6. Do not build a full editorial pipeline with statuses, approvals, or scheduling.

## Approved Direction

### Product Boundary

The repository will host three distinct content domains:

1. `blog`: technical long-form writing, unchanged in route identity and publication purpose.
2. `weekly`: recurring weekly journal issues with issue-number naming and a reference-inspired reading experience.
3. `notes`: lighter, shorter, anytime notes that are still bilingual but not organized as weekly issues.

These domains should share infrastructure, but not share route identity or content semantics.

### Reference Strategy

The `Weekly` experience should follow `tw93/Weekly` closely at the information-architecture level.

Approved interpretation of "copy the reference":

1. The `Weekly` index page should behave like the reference homepage: a card-based issue feed.
2. The `Weekly` detail page should behave like the reference issue page: left-side issue navigation and right-side main content on desktop.
3. Mobile behavior may adapt into a single-column layout, but must preserve the same hierarchy and reading feel.
4. Branding must be replaced with the user's own identity rather than the reference publication name.
5. Route structure changes are intentional and limited to the `/weekly` and `/en/weekly` prefixes.

`Notes` should not copy the `Weekly` detail pattern. It should remain a lighter publication surface with card listings and a simpler detail page.

## Branding and Navigation

### Weekly Branding

The `Weekly` publication name is approved as:

1. `vw2x 周记`

This name should appear in the `Weekly` shell where the reference site shows its own publication branding.

### Weekly Navigation

The `Weekly` shell should include a top navigation modeled on the reference structure, but mapped to the user's publication set.

Required entries:

1. Publication brand: `vw2x 周记`
2. `Blog`
3. `GitHub`
4. `RSS`

Search and language-switch controls should remain available in the shell where consistent with the current repository behavior.

`Notes` does not need a unique top navigation in this pass. It may use the site's existing shell unless a small route-local variant is needed for consistency.

## Routing

### Weekly Routes

The approved route structure is:

1. Chinese weekly index: `/weekly`
2. English weekly index: `/en/weekly`
3. Chinese weekly detail: `/weekly/[slug]`
4. English weekly detail: `/en/weekly/[slug]`

The first seeded issue should resolve to:

1. `/weekly/2615-start-recording`
2. `/en/weekly/2615-start-recording`

### Notes Routes

The approved route structure is:

1. Chinese notes index: `/notes`
2. English notes index: `/en/notes`
3. Chinese notes detail: `/notes/[slug]`
4. English notes detail: `/en/notes/[slug]`

### Existing Blog Routes

The existing `blog` routes remain unchanged:

1. `/blog/...`
2. `/en/blog/...`

This separation is required so future content and navigation do not blur the difference between technical articles, weekly issues, and lightweight notes.

## Content Model

### Weekly Content

`Weekly` content should live under:

1. `src/content/weekly/zh`
2. `src/content/weekly/en`

Each `Weekly` document should support at least:

1. `title`
2. `date`
3. `updated`
4. `summary`
5. `keywords`
6. `lang`
7. `translationKey`
8. `cover`
9. `coverAlt`

Additional `Weekly`-specific metadata should be introduced:

1. `issue`: numeric issue identifier, for example `2615`
2. `issueLabel`: optional formatted label when the default title-derived rendering is not enough

Naming rules:

1. The visible title may be `2615 - 开始记录` or `2615 - Start Recording`.
2. The slug should remain stable and shared across languages.
3. The `translationKey` must be shared across both language versions.

### Notes Content

`Notes` content should live under:

1. `src/content/notes/zh`
2. `src/content/notes/en`

Each `Notes` document should support at least:

1. `title`
2. `date`
3. `updated`
4. `summary`
5. `keywords`
6. `lang`
7. `translationKey`
8. `cover`
9. `coverAlt`

`Notes` does not require `issue` numbering.

### Shared Bilingual Rules

Both `Weekly` and `Notes` must use the same pairing rules already used by `blog`:

1. Chinese and English counterparts share the same `translationKey`.
2. Chinese and English counterparts share the same slug.
3. Language switching should route directly to the counterpart document when available.
4. Missing counterpart behavior must be explicit and visible in verification rather than silently ignored during release preparation.

## Page Design

### Weekly Index

The `Weekly` index should follow the reference homepage structure:

1. Image-first card grid
2. Issue title in the `2615 - 开始记录` format
3. Date visible inside the card structure
4. Short summary or excerpt under the title
5. Dense but readable multi-column desktop layout
6. Single-column mobile layout

This page should feel like a visual issue archive, not like the existing technical blog feed.

### Weekly Detail

The `Weekly` detail page should follow the reference issue page structure:

1. Fixed or sticky issue list on the left at desktop widths
2. Current issue title and hero cover on the right
3. Lead paragraph or issue summary under the hero
4. Main body content below with section headings and standard markdown content
5. Mobile fallback to a single-column flow with issue navigation moved above or below the content

This page should be distinct from the existing blog detail page.

### Notes Index

The `Notes` index should remain card-based, but simpler than `Weekly`:

1. Card feed listing
2. Lighter metadata density
3. No issue numbering
4. Shorter summaries and lighter reading expectations

### Notes Detail

The `Notes` detail page should use a simpler article detail structure than `Weekly`:

1. Single-column reading layout
2. Title, metadata, and optional cover at the top
3. No left-side issue navigation

## Seed Content

### First Weekly Issue

The first seeded `Weekly` issue should be a real bilingual first issue rather than an empty stub.

Approved seed:

1. Chinese title: `2615 - 开始记录`
2. English title: `2615 - Start Recording`
3. Shared slug: `2615-start-recording`

Its purpose is:

1. Establish the route and rendering structure
2. Provide a visible first issue in the index
3. Give the author a concrete template for future issues

### Initial Notes Scope

This pass does not require shipping a seeded `Notes` entry unless needed for route verification. The primary requirement is to create the `Notes` structure and the `Notes` drafting skill.

## Search and Discovery

### Weekly Search

The existing local search architecture should be extended to index `Weekly` content.

Required result behavior:

1. Search must remain language-specific.
2. `Weekly` results should be searchable by title, summary, and body text.
3. Result presentation should visually match the current site's search modal, not rebuild search as a separate app.

### Notes Search

`Notes` should also be indexed by the same local search system.

The search layer should distinguish among content types well enough that the UI can display an appropriate label or grouping later if desired, even if the first pass keeps the current flat result list.

## Shared Infrastructure Changes

Implementation should extend the existing content and route infrastructure rather than duplicating it.

Required areas to extend:

1. Content collections: add `weekly` and `notes`
2. Content normalization helpers in `src/lib/content.ts`
3. Language switch resolution for `weekly` and `notes`
4. Search document generation across all supported content domains
5. Sitemap and metadata handling for the new routes

Reusable units should remain focused:

1. Collection transforms own route and translation metadata
2. Content helpers own retrieval and pairing logic
3. Route files own metadata and rendering
4. Layout components own publication-specific shells
5. Skills and verification scripts own author workflow automation

## Project-Local Skills

### Weekly Draft Skill

A new project-local skill should help create a bilingual `Weekly` issue draft.

Responsibilities:

1. Accept the author's rough weekly topic or bullet inputs
2. Propose issue title, slug, and summary
3. Create Chinese and English markdown drafts in the `weekly` content tree
4. Set matching `translationKey`
5. Keep the two language versions structurally aligned

The skill should not publish automatically. It should generate editable drafts for author review.

### Notes Draft Skill

A second project-local skill should help create a bilingual `Notes` draft.

Responsibilities:

1. Accept a short thought, link, observation, or sketch
2. Propose title, slug, and summary
3. Create Chinese and English markdown drafts in the `notes` content tree
4. Set matching `translationKey`
5. Keep the tone lighter and shorter than the `Weekly` workflow

### Skill Boundary

The two drafting skills must stay separate because the content intent is different:

1. `Weekly`: issue-based, periodic, branded as `vw2x 周记`
2. `Notes`: ad hoc, lightweight, non-issue content

## Bilingual Verification Workflow

The repository needs a project-local verification workflow for bilingual completeness before push or release.

Required checks:

1. Every `weekly` Chinese document must have a matching English document.
2. Every `weekly` English document must have a matching Chinese document.
3. Every `notes` Chinese document must have a matching English document.
4. Every `notes` English document must have a matching Chinese document.
5. Matching pairs must share the same slug.
6. Matching pairs must share the same `translationKey`.
7. Required frontmatter fields must be present on both sides.

Expected behavior:

1. The workflow should fail loudly when a pair is incomplete.
2. The output should clearly identify the missing or mismatched files.
3. The workflow should be easy to run before push and easy to integrate into a future pre-push hook if the author wants it.

This verification may be implemented as a project-local skill, a script, or both, as long as the author workflow is straightforward.

## Error Handling and Fallbacks

1. Missing counterpart document: fail verification and surface the exact missing path.
2. Missing route match during language switch: fall back safely, but treat it as a verification defect if the content is supposed to be paired.
3. Missing cover: allow graceful no-cover rendering where needed.
4. Missing optional metadata like `updated` or `coverAlt`: render with sensible fallback behavior.

## Verification

Implementation should be verified with:

1. Local build success
2. Manual check of `/weekly` and `/en/weekly`
3. Manual check of `/weekly/2615-start-recording` and `/en/weekly/2615-start-recording`
4. Manual check that `Weekly` desktop detail uses left-side issue navigation
5. Manual check that `Weekly` mobile layout collapses into a readable single-column flow
6. Manual check of `/notes` and `/en/notes`
7. Manual check of at least one `Notes` detail page if seeded in this pass
8. Manual check that language switching works for both `Weekly` and `Notes`
9. Manual check that search indexes the new content types
10. Successful bilingual verification run for `weekly` and `notes`

## Risks

1. Reusing too much of the existing `blog` UI could blur the distinction between technical articles and `Weekly`.
2. Reusing too little infrastructure could create unnecessary duplication and raise future maintenance cost.
3. If `Weekly` and `Notes` are both added without a clear content-type boundary in code, the search and language-switch layers may become brittle.
4. If the drafting skills generate mismatched slugs or `translationKey` values, the verification workflow will catch it, but the user experience will feel noisy unless the skill output is deterministic.

## Implementation Boundary

This design covers:

1. New `weekly` content model, routes, and seeded issue
2. New `notes` content model and routes
3. `Weekly` index and detail layouts modeled on the reference structure
4. `Notes` index and detail layouts distinct from `Weekly`
5. Shared bilingual routing and search integration
6. Project-local drafting skills for `Weekly` and `Notes`
7. Project-local bilingual verification workflow for those two domains

This design does not cover:

1. Migrating `Weekly` into a separate deployed subdomain app
2. Changing the existing `blog` route identity
3. Automating publication to a remote service
4. Building a generalized editor or CMS
