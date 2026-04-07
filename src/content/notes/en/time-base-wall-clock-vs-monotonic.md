---
title: "Why Systems Need Both CLOCK_REALTIME and CLOCK_MONOTONIC"
date: "2026-04-07"
lang: "en-US"
translationKey: "time-base-wall-clock-vs-monotonic"
summary: "Operating systems provide both realtime and monotonic because “what time is it” and “how much time passed” are different questions."
keywords:
  - time base
  - monotonic
  - realtime
  - Android
  - debugging
---

# Why Systems Need Both CLOCK_REALTIME and CLOCK_MONOTONIC

Operating systems expose two clocks because the system needs to answer two different questions:

- `CLOCK_REALTIME` answers “what time is it now?” and changes with manual clock updates or network sync.
- `CLOCK_MONOTONIC` answers “how much time has passed?” and should not jump when wall time changes.

If only realtime existed, `timeout`, retry, window, and duration logic would drift after clock changes. If only monotonic existed, logs, timestamps, and expiration times could not map to real-world time.

Common `C` calls:

```c
clock_gettime(CLOCK_REALTIME, &ts);
clock_gettime(CLOCK_MONOTONIC, &ts);
```
