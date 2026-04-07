# Notes Timeline Grid Design

## Context

The repository already ships a bilingual `notes` section under `/notes` and `/en/notes`.

The current `notes` index uses a flat multi-column card grid. It is readable, but it does not yet create the feeling of a continuous record stream. The user wants the page to feel more structured, more visual, and more temporal without turning it into a literal activity log.

The approved direction from brainstorming is:

1. Keep `notes` title-driven rather than turning it into a pure date heatmap.
2. Replace the current flat grid with a square-card archive that is grouped by day.
3. Make the time-axis feeling stronger than the current design.
4. Do not show exact times such as hour or minute.
5. Keep the card content to `title + one line of supporting small text`.

## Goals

1. Redesign the `notes` index into a time-structured archive rather than a uniform card wall.
2. Preserve the lightweight and accumulative identity of `notes`.
3. Make the page feel like a scrolling timeline while still letting titles remain the primary reading entry point.
4. Support dense desktop layouts, including very wide screens that can approach eight cards per row inside a daily group.
5. Keep the layout usable on mobile without dropping the timeline concept entirely.

## Non-Goals

1. Do not redesign the `notes` detail page in this pass.
2. Do not add new content fields or require note-level time-of-day metadata.
3. Do not turn the page into a literal log viewer with timestamps, badges, or operational metadata.
4. Do not introduce a separate visual system for English pages.
5. Do not implement month, year, or tag filtering in this pass.

## Approved Direction

### Core Layout

The `notes` index should move from a single global grid to a grouped timeline wall:

1. The page is organized by day.
2. Each day is rendered as one section.
3. The left side of each section carries the date marker and the vertical timeline spine.
4. The right side renders the notes for that day as a dense near-square card grid.

This keeps the page title-driven while making the date progression visually explicit.

### Time Structure

The timeline should be visible enough to define the page rhythm, but not so strong that it steals attention from note titles.

Approved structure:

1. A continuous or visually linked vertical line on the left.
2. A circular node or similar marker for each day.
3. A compact month label and a larger day number, for example `Apr` and `07`.
4. No exact hour or minute anywhere in the card or group chrome.

The date label belongs to the left-side timeline area. Cards should not repeat the same date.

### Card Structure

Each note card should remain lightweight and title-led.

Approved card information hierarchy:

1. Title at the top, clamped to roughly two lines.
2. One supporting line of smaller text beneath it, using the note summary or a similarly lightweight excerpt.
3. No per-card timestamp.
4. No extra badge system in this pass.

The small supporting line is intentionally not heavy metadata. Its job is to give the title one more breath of context.

### Shape and Density

Cards should read as square blocks, but the implementation should avoid overly rigid `1:1` geometry.

Approved interpretation:

1. Cards should be visually near-square.
2. Layout should tolerate title-length variation in Chinese and English.
3. It is acceptable for the final ratio to be slightly taller than a perfect square if that improves readability and reduces awkward truncation.

The desktop layout should scale by available width:

1. Very wide displays can approach eight cards in one row within a daily section.
2. Normal desktop widths should fall back naturally to roughly four to six cards per row.
3. Tablet widths should reduce further without breaking the day-group rhythm.
4. Mobile should use one or two columns while preserving the left-side timeline cue.

## Page Rhythm

### Daily Grouping

Each day should feel like a distinct segment in a larger flow.

Approved grouping rules:

1. The main divider between groups is the date marker and the vertical spacing between day sections.
2. Avoid heavy horizontal separators.
3. Let whitespace and the timeline structure do most of the grouping work.
4. If a day contains only one or two notes, keep the natural whitespace rather than artificially filling the row.

This allows sparse days to contribute to the feeling of a real archive rather than a rigid gallery.

### Scroll Experience

The page should feel like following a record stream downward:

1. Users first notice time progression.
2. Users then scan what was recorded on each day.
3. The visual emphasis should support browsing, not force linear reading.

This is the central experience change from the current flat grid.

## Visual Direction

The page should not become a portfolio wall or a decorative showcase. It should still feel like a public working archive.

Approved visual character:

1. Light card surfaces rather than dramatic, heavy blocks.
2. Restrained shadows and hover motion.
3. The timeline acts as the structural backbone.
4. The page should feel calmer and more archival than performative.

Hover behavior should stay subtle:

1. Slight lift or shadow change is enough.
2. Avoid loud animations or overly playful transitions.

## Data and Rendering

### Data Grouping

The implementation should reuse the existing note source and derive daily groups from the current date field.

Approved data rule:

1. Group notes by day using the existing date value.
2. Sort groups in reverse chronological order.
3. Preserve note order within a day in a predictable way, preferably newest-first if the existing source already behaves that way.
4. Do not require any schema change.

### Summary Fallback

If a note lacks a summary, the card should still render without collapsing the layout.

Approved fallback behavior:

1. Prefer summary when present.
2. If absent, allow the supporting line to be empty or use a restrained fallback strategy that does not visually overpower the title.

The fallback should stay minimal rather than inventing new metadata.

## Localization

Chinese and English notes pages should share the same structural design.

Approved localization rule:

1. Same layout for `/notes` and `/en/notes`.
2. Typography may follow the existing locale-specific font choices.
3. Card geometry and timeline rhythm must remain consistent across locales.

## Implementation Scope

This design only requires changes around the `notes` index page and its supporting list components.

Expected surface area:

1. Replace the current flat grid component with a grouped timeline layout.
2. Adjust the note card component for near-square density and simplified metadata.
3. Add any small utility logic needed to group notes by day.
4. Leave the detail page untouched.

## Verification Expectations

Before considering implementation complete, verification should cover:

1. The Chinese and English notes indexes both render grouped daily sections.
2. Desktop widths show dense square-like card layouts without broken overflow.
3. Mobile retains a visible timeline cue and readable card stack.
4. Notes without summaries still render cleanly.
5. The new layout does not regress route behavior or note linking.
