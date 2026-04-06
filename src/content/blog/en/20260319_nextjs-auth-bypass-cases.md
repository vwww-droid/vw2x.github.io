---
title: "CVE-2025-29927 and CVE-2023-27490"
date: "2026-03-19"
featured: false
summary: "I do not try to control the whole system. I focus on the parts I can control and influence."
keywords: ["Web Penetration Testing", "Next.js"]
lang: "en-US"
translationKey: "nextjs-auth-bypass-cases"
---

## Why I Wrote This

Recently I was working on a Next.js app. While discussing one middleware implementation, I started thinking about a possible authorization bypass.

AI mentioned `CVE-2025-29927`, which is a Next.js middleware authorization bypass. Many Next.js apps put access control in middleware, and if that layer can be skipped, the page, route handler, or API route behind it may be exposed directly.

The core issue is that an internal control signal was influenced by external input, and because it was not tightly bound to context, the authorization check could be bypassed.

The entry points for `CVE-2023-48309`, `CVE-2022-24858`, and `CVE-2023-27490` are similar.

With AI pushing more people to build their own sites and apps, the usual pattern is "make it work first", which makes these mistakes very easy to introduce. If you do not pay attention, they can become real loss events.

## Context

### 1) `CVE-2025-29927`, Next.js middleware authorization bypass

- Scenario: the app puts access control in middleware and decides internal access control based on a request header.
- Attack path: an external request injects a signal that affects internal semantics, causing middleware to be skipped.
- Risk: once the front authorization layer is bypassed, the downstream routes are exposed.

External input controls an internal flag -> possible bypass.

### 2) `CVE-2023-48309`, NextAuth possible user mocking

- Scenario: default middleware plus overly weak authorization checks.
- Attack path: after the system produces a token, it only checks `if (token)` and lets the request through.

If it exists, it is treated as valid. That is a bit absurd.

### 3) `CVE-2022-24858`, NextAuth open redirect

- Scenario: the login callback accepts a user-controlled `callbackUrl`.
- Attack path: combined with phishing, the trust chain gets used for `trust laundering`.

The redirect is not bound-checked.

### 4) `CVE-2023-27490`, missing OAuth checks (`state/pkce/nonce`)

- Scenario: OAuth login does not finish in one request. It goes through several hops, including browser redirects, third-party authorization, and the server callback. If any of `state`, `pkce`, or `nonce` is not checked correctly, the whole chain can get bound to the wrong identity.
- The three fields:
  - `state`: confirms whether this callback belongs to the login request I just started, so nobody can inject a fake callback.
  - `pkce`: confirms that the person who received the `code` and the person who exchanges it for a token are the same client, so a stolen code cannot be reused by someone else.
  - `nonce`: confirms that the returned token really belongs to this login, so old tokens are not replayed and identities are not mixed up.
- The attack path can be understood in five steps:
  1. The attacker tampers with the authorization entry parameters and tricks the user into opening a modified OAuth link.
  2. The user logs in normally at the IdP, and the platform returns the `code` and related parameters.
  3. The affected implementation does not fully verify `state/pkce/nonce`, or it fails to stop when the check fails.
  4. Some failure branches do not terminate or clean up completely, so intermediate artifacts can still be reused.
  5. In the end, the system may bind the login state to the wrong person. Best case, account state becomes inconsistent; worst case, the identity is taken over.
- Risk: it does not always show up as "account takeover in seconds", but it does blur identity boundaries. For an authentication system, that is a high-risk signal.
- Defense: verification must be mandatory, the flow must be atomic, failures must fail closed, and checks must happen before side effects.
- What I took away: having these fields is not enough. The checks must be impossible to skip, impossible to downgrade, and must terminate on failure.

## Notes

For an attacker:
1. Which inputs does this authorization depend on
2. Which of those inputs can I control
3. Can I intervene in the middle, test the binding, and capture intermediate state

For the code author:
1. Which inputs does this authorization depend on
2. Can the client influence those inputs
3. Does the failure path really fail closed
4. Does the fix restore the invariant instead of only blocking a known payload

If any layer treats untrusted input as a trusted control signal, the system will leak.

## Hardening

In my Next.js project, I would make these changes:

- middleware layer: keep front access control and early rejection so the user experience stays responsive.
- page/api layer: even if the front layer passes, still verify identity and authorization truth.
- data layer: bind real queries.

## References

- NVD: [CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- GHSA: [Next.js advisory](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw)
- Patch:
  - [commit-1](https://github.com/vercel/next.js/commit/52a078da3884efe6501613c7834a3d02a91676d2)
  - [commit-2](https://github.com/vercel/next.js/commit/5fd3ae8f8542677c6294f32d18022731eab6fe48)
- CVE refs:
  - [CVE-2023-48309](https://nvd.nist.gov/vuln/detail/CVE-2023-48309)
  - [CVE-2022-24858](https://nvd.nist.gov/vuln/detail/CVE-2022-24858)
  - [CVE-2023-27490](https://nvd.nist.gov/vuln/detail/CVE-2023-27490)
- Research writeup: [zhero](https://zhero-web-sec.github.io/research-and-things/nextjs-and-the-corrupt-middleware)
