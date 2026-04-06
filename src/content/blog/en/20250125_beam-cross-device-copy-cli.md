---
title: "Beam: A Clean CLI for Cross-Device Copy and Paste"
date: "2026-01-25"
featured: true
summary: "Two commands for cross-device copy and paste, with optional encrypted transfer."
keywords: ["Beam", "clipboard", "cross-device", "encryption", "CLI", "Python"]
lang: "en-US"
translationKey: "beam-cross-device-copy-cli"
---

## Background

When I work on two computers and want to move copied text, configs, commands, or snippets to the other machine, the UI flow is always tedious, like using WeChat, DingTalk, or AirDrop.

I also do not like installing clients. `localsend` still needs the same LAN, and I am used to my current input method setup, so I do not want to switch to something like WeChat Input Method.

Web clipboards were much faster, but I still had to open the same URL, paste, save, and exit. And those sites usually transmit in plain text, so anyone who knows the URL can see the content.

So I wrapped a simple command-line tool: **two commands for cross-device copy and paste, with optional encrypted transfer**.

```bash
# On device A
# Copy clipboard contents
bm c
# Or copy a specific string
# bm c "hello world"

# On device B
bm p
```

That is all. No pairing, no shared LAN, and no tedious UI flow. As long as the devices can reach the internet, it works.

## Key Features

**Low memory cost** - only two commands to remember: `bm c` copies and `bm p` pastes. No complex configuration, no learning curve.

**Cross-platform** - works directly in Mac, Linux, and Windows terminals; on mobile, just open the URL in a browser.

**Encrypted by default** - all content is compressed and encrypted before upload, so the server only sees gibberish. Custom passwords and private deployment are supported.

**Ready to use** - install with `pip install beam-clipboard` and start using it right away. First run will guide you through setting a personal key.

## Use Cases

**Sync between multiple computers**  
Copy a snippet while coding, switch to another machine, and paste immediately. Transferring a token or a config file becomes a second-level operation.

**Computer-to-phone transfer**  
Run `bm c --plain "content"` on your computer, then open your personal URL in a phone browser to see it. Type text in the phone web page, and `bm p` on the computer can fetch it.

**Temporary text relay**  
Faster than WeChat File Transfer and simpler than emailing yourself. Good for commands, code snippets, and temporary notes.

## Technical Highlights

- Pure Python, no extra dependencies
- Built on the free TextDB API, with **private deployment supported**
- Compression reduces transfer size by 60%
- Lightweight XOR + SHA256 encryption
- MIT licensed

## One-Line Summary

**Beam makes cross-device copy and paste as simple as local copy and paste.**

If you are also tired of all the friction involved in moving text between devices, give Beam a try.

## Support

Beam is still mainly something I use myself, and the features are evolving from my own needs. If you think it is useful, feel free to give it a star on [GitHub](https://github.com/vwww-droid/Beam) ⭐️

Issues and PRs are also welcome if you have ideas or needs. More feedback and participation will make the tool better.

---

Install: `pip install 'beam-clipboard[clipboard]'`

More usage: https://github.com/vwww-droid/Beam
