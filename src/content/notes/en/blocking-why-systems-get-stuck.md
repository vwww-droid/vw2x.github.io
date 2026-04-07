---
title: "Common Causes of Blocking"
date: "2026-04-07"
lang: "en-US"
translationKey: "blocking-why-systems-get-stuck"
summary: "A path that should stay light ends up carrying a few heavy steps."
---

Few slow steps occupy a shared path, and everything behind them has to wait.

- a few slow tasks fill the worker pool
- a few slow queries hold the database connections
- one slow message at the head of the queue blocks everything behind it

Common cause: a path that should only make a quick decision also does heavy work.

Common symptom: progress is slow overall, concurrency looks high, but throughput stays low.

The toll-booth analogy helps: under normal conditions each car scans and moves on. If a few cars stop there to open trunks and fill forms, even cars that only need a quick scan must queue behind them. More cars at the entrance do not help, because the booth is the bottleneck.

Unblocking usually starts by making the main path lighter:

- keep only the work that must finish synchronously
- move heavy work to async or on-demand paths
- reduce how long each step holds the shared resource
