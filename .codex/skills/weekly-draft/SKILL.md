---
name: weekly-draft
description: Use when creating a bilingual weekly issue draft in this repository or when a paired zh/en weekly seed needs matching slug and translationKey values.
---

# Weekly Draft

Create paired weekly drafts with `scripts/create_weekly_draft.mjs`.

Usage:
`node .codex/skills/weekly-draft/scripts/create_weekly_draft.mjs [--root PATH] [--date YYYY-MM-DD] [--dry-run] <issue> <slug> <zh-title> <en-title>`

It writes:
- `src/content/weekly/zh/<slug>.md`
- `src/content/weekly/en/<slug>.md`

Both files use the same `slug` and `translationKey`, and both keep the weekly `issue` number aligned.
