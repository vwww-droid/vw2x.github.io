# Blog Setup Guide

This document provides technical details for setting up and configuring this blog.

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Clone or fork the repo, modify configuration following the guide below, then deploy on [Vercel](https://vercel.com).

Use default deployment settings, no special configuration needed.

## Writing Blog Posts

Blog files should be placed in `src/content/blog` directory, supporting both markdown and mdx formats.

### Metadata Fields

- `title`: post title
- `date`: publish date
- `updated`: last updated date
- `keywords`: keywords for SEO optimization
- `featured`: whether to display on homepage
- `summary`: post summary

## Configuration

All blog configurations are centralized in `src/lib/config.ts` for better management.

### Site Configuration

```typescript
site: {
  title: "Your Blog Title",
  name: "Your Blog Name",
  description: "Blog Description",
  keywords: ["keyword1", "keyword2"],
  url: "https://yourdomain.com",
  baseUrl: "https://yourdomain.com",
  image: "https://yourdomain.com/og-image.png",
  favicon: {
    ico: "/favicon.ico",
    png: "/favicon.png",
    svg: "/favicon.svg",
    appleTouchIcon: "/favicon.png",
  },
  manifest: "/site.webmanifest",
}
```

Used for:
- Basic site information display
- SEO optimization
- Browser tab icons
- Social media sharing preview

### Author Configuration

```typescript
author: {
  name: "Your Name",
  email: "your@email.com",
  bio: "Bio description",
}
```

Used for:
- Homepage display
- RSS feed info
- Blog post author info

### Social Media Configuration

```typescript
social: {
  github: "https://github.com/username",
  x: "https://x.com/username",
  xiaohongshu: "https://www.xiaohongshu.com/user/profile/userid",
  wechat: "wechat-qr-code-url",
  buyMeACoffee: "https://www.buymeacoffee.com/username",
}
```

Links displayed in:
- Homepage social media section
- Navigation bar social icons

### Comments (Giscus)

Blog posts embed [Giscus](https://giscus.app/) (GitHub Discussions).

1. In the repo **Settings → General → Features**, turn on **Discussions**.
2. Install the [giscus GitHub App](https://github.com/apps/giscus) for that repo.
3. Open [giscus.app](https://giscus.app), select repo `vwww-droid/vw2x.github.io`, pick a discussion category (e.g. **Announcements**). The generated **category id** is stored in `config.giscus.categoryId` in `src/lib/config.ts` (override with `NEXT_PUBLIC_GISCUS_CATEGORY_ID` if needed).

### Open Graph image

Default share image URL is `config.site.image` (e.g. `https://your-domain/og-image.png`). Replace `public/og-image.png` with your own 1200×630 (or similar) asset.

### Navigation Menu Configuration

```typescript
navigation: {
  main: [
    { 
      title: "Posts", 
      href: "/blog",
    },
    // add more nav items
  ],
}
```

Supports:
- Regular links
- Dropdown menus with sub-items

### SEO Configuration

```typescript
seo: {
  metadataBase: new URL("https://yourdomain.com"),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: "website" as const,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: "@your-twitter",
  },
}
```

Used for:
- Search engine optimization
- Social media sharing cards
- Site metadata

### RSS Feed Configuration

```typescript
rss: {
  title: "Your Blog Title",
  description: "Blog Description",
  feedLinks: {
    rss2: "/rss.xml",
    json: "/feed.json",
    atom: "/atom.xml",
  },
}
```

Generates:
- RSS 2.0 feed
- JSON Feed
- Atom feed

## Generating RSS Feed

Modify configuration in `scripts/generate-rss.js`, then run:

```bash
npm run generate-rss
```

## Generating Sitemap

Modify configuration in `scripts/generate-sitemap.js`, then run:

```bash
npm run generate-sitemap
```

## Configuration Checklist

After modifying configuration, verify:
- Homepage display
- Navigation menu
- SEO information
- Social media sharing
- RSS feeds
- All URLs are valid
- Image links are accessible
