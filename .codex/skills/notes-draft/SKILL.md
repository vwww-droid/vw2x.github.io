---
name: notes-draft
description: Use when creating a bilingual notes draft in this repository or when a paired zh/en notes seed needs matching slug and translationKey values.
---

# Notes Draft

Create paired note drafts with `scripts/create_note_draft.mjs`.

Usage:
`node .codex/skills/notes-draft/scripts/create_note_draft.mjs [--root PATH] [--date YYYY-MM-DD] [--dry-run] <slug> <zh-title> <en-title>`

It writes:
- `src/content/notes/zh/<slug>.md`
- `src/content/notes/en/<slug>.md`

Both files use the same `slug` and `translationKey`.
