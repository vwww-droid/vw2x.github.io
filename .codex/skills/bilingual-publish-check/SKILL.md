---
name: bilingual-publish-check
description: Use when weekly or notes content is about to be published or pushed and bilingual pair verification needs to run first.
---

# Bilingual Publish Check

Run `node scripts/verify-bilingual-content.mjs` before publish or push.

The verifier checks weekly and notes zh/en pairs, matching slugs and `translationKey` values, and the required frontmatter fields for each file.

Fix any errors before release.
