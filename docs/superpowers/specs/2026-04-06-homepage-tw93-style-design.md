# Homepage Redesign Inspired by tw93.fun

## Context

The current homepage already has a minimal structure, but its visual language is still closer to a generic component-driven blog than the quieter editorial style the site owner wants.

The redesign will borrow the strongest signals from `tw93.fun`:

1. A fixed top navigation with plain text links.
2. A restrained warm-gray palette instead of a stark black-and-white contrast.
3. A calligraphic Chinese-first reading experience.
4. A homepage post list that reads like a continuous index instead of a stack of cards.

The redesign will not clone the source site literally. Two explicit user constraints override that:

1. The motto must not live inside a separate large dark hero block.
2. Each article entry must not have its own obvious bordered or boxed card.

## Goals

1. Make the homepage feel much closer to the aesthetic rhythm of `tw93.fun`.
2. Replace the current component-library navigation feel with a simpler editorial header.
3. Turn the homepage into a continuous reading surface with strong typography and generous spacing.
4. Keep the implementation small and focused so the redesign can land without rewriting the whole site.

## Non-Goals

1. Do not build the real `Weekly` site in this repository.
2. Do not add search, language switching, or animated hero effects.
3. Do not redesign the entire article detail page in this pass.
4. Do not introduce complex interactions that would move the site away from a calm static blog.

## Approved Direction

### Information Architecture

The homepage structure will be:

1. Fixed top navigation.
2. A shallow intro band below the navigation.
3. A plain flowing blog index.

The navigation will follow the source site's layout pattern but with the current site's actual destinations:

1. `vw2x` as the site title on the left.
2. `Weekly` as an external placeholder link for a future subdomain.
3. `GitHub` as the current external social link.
4. `About` as an internal page link.

Search, Twitter, and language switching will be omitted.

### Hero and Motto Treatment

The homepage will keep a light intro area instead of a dark full-width slogan block.

This intro area will contain:

1. The site title as the dominant element.
2. One faint single-line motto beneath it.

The current line `As tiny as it is, there is a difference.` will remain for now and be rendered as quiet supporting text instead of a standalone feature block.

### Post List Treatment

The homepage list will shift from card-like entries to a continuous editorial list.

Each post row will include:

1. Title.
2. Date metadata.
3. Summary.

Presentation rules:

1. No individual white cards, borders, or shadows for each post.
2. Separation should come from vertical spacing, text hierarchy, and rhythm.
3. Titles should feel more prominent and literary.
4. Summaries should be easier to scan with looser line height and softer contrast.

## Visual System

### Typography

The redesign should prioritize the same font family currently used by `tw93.fun`, which is exposed in CSS as `TsangerJinKai02` and corresponds to `仓耳今楷`.

Font strategy:

1. Prefer loading `仓耳今楷` through the same public stylesheet source that exposes `TsangerJinKai02`.
2. Keep a fallback stack centered on `STKaiti`, `KaiTi`, and common system sans-serif fonts.
3. Use the same family across headings, body text, navigation, and list items for visual consistency.

This change is intentionally high impact. The goal is not subtle refinement but a clear move toward the desired reading mood.

### Color

The source site uses a restrained warm-gray system. The redesign should adapt that palette instead of reusing the current dark theme defaults.

Target palette:

1. Page background: warm light gray.
2. Content surface: soft white or near-white.
3. Primary text: deep ink gray.
4. Secondary text: muted cool-gray.
5. Hover and active states: darker ink, not accent-color driven.

The site should feel calm and paper-like rather than app-like.

### Spacing and Density

The redesign should emulate the source site's spacious but not luxurious layout.

Rules:

1. Keep the main reading width around the current medium column width.
2. Increase whitespace around the intro area and article titles.
3. Reduce decorative framing so the page relies on proportions instead of containers.

## Component-Level Changes

### Header

Replace the current desktop navigation implementation with a simpler plain-text layout closer to the reference site.

Requirements:

1. Keep the header fixed at the top on desktop.
2. Keep the site title visually stronger than the rest of the links.
3. Remove dropdown-trigger styling and button-like navigation treatments.
4. Keep hover states understated.

### Homepage

The homepage component should stop centering the title as an isolated display headline detached from the rest of the page.

Requirements:

1. Create a shallow intro section with the site title and a quiet subtitle.
2. Remove the current standalone centered motif treatment.
3. Flow directly from the intro area into the blog index.

### Blog List

The blog list component should become the main expression of the new style.

Requirements:

1. Render entries without card wrappers.
2. Increase title size and make the reading order obvious.
3. Keep metadata present but visually secondary.
4. Preserve the current summary-based list model.

## Weekly Placeholder Handling

`Weekly` should behave as a future external destination, not a page inside this app.

Implementation requirement:

1. Add a configurable placeholder URL in site configuration.
2. Use it as the external target for the `Weekly` navigation link.
3. Keep the implementation reversible so the real subdomain can replace it later without changing layout code.

Default placeholder target for this pass:

1. `https://weekly.vw2x.com`

If the subdomain is not live yet, the exact URL can be adjusted during implementation without changing the design.

## Mobile Behavior

The homepage must still read cleanly on mobile.

Requirements:

1. Preserve the calm typography and spacing on small screens.
2. Avoid horizontal crowding in the navigation.
3. Keep the intro band shallow rather than turning it into a tall mobile hero.
4. Keep metadata legible without overwhelming titles.

## Testing and Verification

Implementation should be verified with:

1. Local visual inspection on desktop width.
2. Local visual inspection on mobile width.
3. Sanity check that navigation links still resolve correctly.
4. Sanity check that blog list ordering and summaries remain intact.

## Risks

1. A full-site font swap may affect detail pages more strongly than the homepage.
2. The public font resource may load differently from the current CDN-hosted font setup.
3. Removing card structure can make the list feel too flat if spacing and hierarchy are not tuned carefully.

## Implementation Boundary

This design covers the first pass only:

1. Global typography and color foundation.
2. Header simplification.
3. Homepage intro block refinement.
4. Homepage blog index restyling.
5. Weekly placeholder navigation target.

Anything beyond this should be considered a separate follow-up pass.
