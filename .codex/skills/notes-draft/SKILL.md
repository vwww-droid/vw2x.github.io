---
name: notes-draft
description: Use when creating a bilingual lightweight notes draft in this repository or when a paired zh/en notes seed needs matching slug and translationKey values.
---

# Notes Draft

Create paired lightweight note drafts with `scripts/create_note_draft.mjs`.

Use this skill for `notes(笔记页)` content, not for `blog(展示页)` content.

Positioning:
- `blog`: longer-form public writing intended for homepage display and stronger presentation.
- `notes`: lighter public notes meant for quick capture, accumulation, and frequent publishing.
- `notes` drafts should stay no-cover by default. Keep them lightweight unless there is a clear reason to promote the topic into `blog`.

Usage:
`node .codex/skills/notes-draft/scripts/create_note_draft.mjs [--root PATH] [--date YYYY-MM-DD] [--dry-run] <slug> <zh-title> <en-title>`

It writes:
- `src/content/notes/zh/<slug>.md`
- `src/content/notes/en/<slug>.md`

Both files use the same `slug` and `translationKey`.
The generated drafts intentionally omit `cover` and `coverAlt`.
