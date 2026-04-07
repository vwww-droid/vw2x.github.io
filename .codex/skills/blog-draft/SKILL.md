---
name: blog-draft
description: Use when creating a bilingual long-form blog draft in this repository or when a paired zh/en blog draft needs matching slug and translationKey values.
---

# Blog Draft

Create paired long-form blog drafts with `scripts/create_blog_draft.mjs`.

Use this skill for `blog(展示页)` content, not for `notes(笔记页)` content.

Positioning:
- `blog`: longer-form public writing intended for homepage display, stronger presentation, and external sharing.
- `notes`: lighter public notes meant for quick capture, accumulation, and frequent publishing.
- Use `blog-draft` when the topic already deserves a finished post shape rather than a lightweight note.

Usage:
`node .codex/skills/blog-draft/scripts/create_blog_draft.mjs [--root PATH] [--date YYYY-MM-DD] [--dry-run] <slug> <zh-title> <en-title>`

It writes:
- `src/content/blog/zh/<slug>.md`
- `src/content/blog/en/<slug>.md`

Both files use the same `slug` and `translationKey`.
The generated drafts include long-form post metadata such as `featured`, `summary`, and `keywords`.
The generated drafts intentionally omit `cover` and `coverAlt` so you can decide later whether the post needs an explicit presentation asset.
