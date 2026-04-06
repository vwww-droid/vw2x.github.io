# Weekly Style Comments Design

## Goal

Rebuild the blog post comment area so it matches the visual and interaction style used in `tw93/Weekly`, while keeping the current Next.js blog structure intact.

This change is intentionally limited to the comment area and its immediate container. The article body layout, table of contents layout, and broader page shell are out of scope.

## Target Experience

On each blog post page, the comment section should feel like a first-party part of the site rather than a default embedded widget.

The target experience includes:

1. A dedicated comment card with spacing and padding close to `tw93/Weekly`.
2. Giscus iframe content themed with site-owned light and dark CSS files instead of the default built-in theme.
3. Matching typography, button styling, border treatment, comment line-height, and reaction area copy.
4. Input area placed at the bottom, consistent with the Weekly implementation.
5. Theme synchronization when the page is rendered in light or dark mode.

## Approach

Use the existing `@giscus/react` integration and replace the current static `theme="light"` usage with custom theme URLs served from `public/styles`.

This keeps the comment backend unchanged and limits the work to presentation and runtime configuration.

## Components And Responsibilities

### 1. Public Giscus Theme Files

Add two static files:

1. `public/styles/giscus-light.css`
2. `public/styles/giscus-dark.css`

These files will define the iframe-internal Giscus appearance. They will closely follow the `tw93/Weekly` theme files, including:

1. JinKai font import and typography settings.
2. Button colors and border styles.
3. Header suppression.
4. Reaction summary text replacement with `欢迎一起交流~`.
5. Comment body sizing and spacing.
6. Input focus treatment.

### 2. Comment Component Runtime Logic

Update `src/components/giscus-comments.tsx` so it:

1. Resolves the correct theme URL from `window.location.origin`.
2. Detects whether the document root is currently in dark mode.
3. Passes the correct theme URL into the initial Giscus render.
4. Watches for root class changes and re-sends theme configuration into the loaded iframe with `postMessage`.
5. Keeps the rest of the Giscus repository configuration unchanged.

This mirrors the behavior used in `tw93/Weekly`, adapted to the current Next.js component model.

### 3. Blog Post Comment Container

Adjust the wrapper in `src/app/blog/[...slug]/page.tsx` so the comment block visually sits like a dedicated section rather than a generic repeated white card.

The container should move closer to the Weekly spacing model:

1. Tighter separation from the article on mobile.
2. Larger horizontal padding on desktop.
3. A stable maximum width aligned with the article card.
4. No structural changes to the main article card or table of contents.

## Data Flow

The flow is:

1. The blog page renders the comment wrapper.
2. The comment component computes the current theme URL.
3. Giscus is initialized with the custom theme URL.
4. If the root theme changes after mount, the component posts a `setConfig.theme` message to the iframe.
5. The iframe applies the matching light or dark stylesheet hosted from the current site origin.

## Error Handling

If Giscus configuration is incomplete, the component will continue returning `null`, same as today.

If the iframe is not yet present when a theme sync runs, the sync should no-op and retry on the next state change or effect cycle.

If the page is served without a dark class, the component should safely default to the light theme file.

## Testing Strategy

Because this repository does not currently have an established unit test setup for React components, use a minimal verification-first approach:

1. Add a focused testable helper only if it improves confidence without introducing a new test framework.
2. Run `next build` as the required regression check.
3. Inspect the generated blog page in the browser to verify:
   1. The comment section uses the custom theme URL.
   2. The `欢迎一起交流~` copy appears.
   3. The input area is at the bottom.
   4. Light mode and dark mode both produce the expected styling.

If a small pure helper is extracted for theme URL resolution or theme detection, add a narrow test around that helper using the lightest existing mechanism available. Do not introduce a heavyweight testing stack for this task alone.

## Risks

1. The current site appears to render with a dark root class in production while also using light-oriented page tokens in some places. This can create mixed-theme results if comment theming is not explicitly synchronized.
2. Giscus iframe styling is sensitive to hosted CSS URLs. Any wrong origin or wrong path will silently fall back to a mismatched appearance.
3. Over-copying Weekly layout styles into the post page could regress the article shell. The implementation must stay constrained to the comment area and its immediate wrapper.

## Acceptance Criteria

The work is complete when all of the following are true:

1. Blog posts render Giscus using site-hosted custom theme CSS instead of the built-in `light` theme.
2. The comment area visually matches the Weekly style closely in typography, spacing, button styling, and reaction prompt copy.
3. The comment input is displayed at the bottom.
4. Switching between light and dark page states updates the Giscus iframe theme correctly.
5. `next build` passes without introducing lint or type regressions caused by this change.

## Out Of Scope

1. Rebuilding the article page to fully match the Weekly page shell.
2. Changing the Giscus repository, category, mapping, or discussion model.
3. Reworking the site-wide theme system beyond what is required for comment theme synchronization.
