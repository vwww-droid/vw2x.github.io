---
title: "时间基准: CLOCK_REALTIME 和 CLOCK_MONOTONIC"
date: "2026-04-07"
lang: "zh-CN"
translationKey: "time-base-wall-clock-vs-monotonic"
summary: "现在几点和过了多久是两类不同问题."
keywords:
  - C
  - monotonic
  - realtime
  - Android
---


操作系统同时提供两种时钟, 是因为系统要同时回答两个不同问题:

- `CLOCK_REALTIME` 负责“现在几点”, 会随人工改时间和网络校时变化.
- `CLOCK_MONOTONIC` 负责“过了多久”, 不该被这些变化打断.

如果只保留前者, `timeout(超时)`、重试、窗口、`duration(持续时长)` 会在调整时间后失真. 

如果只保留后者, 日志、时间戳、到期时间等没法对应真实世界时间.

`C` 里常见调用:

```c
clock_gettime(CLOCK_REALTIME, &ts);
clock_gettime(CLOCK_MONOTONIC, &ts);
```
