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

### Comments System Configuration

```typescript
giscus: {
  repo: "your-repo",
  repoId: "repo-id",
  categoryId: "category-id",
}
```

Using Giscus as comment system requires:
1. Install Giscus app on GitHub
2. Enable Discussions in your repo
3. Get configuration info and fill here

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
