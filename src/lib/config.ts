export type WeChatPublicConfig = {
  label?: string;
  accountName?: string;
  qrSrc?: string;
  url?: string;
};

const wechatPublic: WeChatPublicConfig = {
  label: "WeChat",
  accountName: "vw2x",
};

const siteOrigin = "https://vw2x.vercel.app";

export const config = {
  site: {
    title: "vw2x",
    name: "vw2x",
    /** Short line under the site title on the home page */
    tagline: "As tiny as it is, there is a difference.",
    description: {
      "zh-CN": "记录学习和思考的过程",
      "en-US": "Notes on learning, building, and thinking",
    },
    keywords: ["vw2x", "AI", "Full Stack Developer"],
    url: siteOrigin,
    baseUrl: siteOrigin,
    image: `${siteOrigin}/og-image.png`,
    favicon: {
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/favicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "vw2x",
      description: "Thoughts on Full-stack development, AI",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "vw2x",
    email: "vwvw2025@outlook.com",
    bio: "welcome!",
  },
  localeLabels: {
    home: {
      "zh-CN": "首页",
      "en-US": "Home",
    },
    blog: {
      "zh-CN": "文章",
      "en-US": "Blog",
    },
  },
  social: {
    github: "https://github.com/vwww-droid",
    weekly: "https://weekly.vw2x.com",
    wechatPublic,
  } satisfies {
    github: string;
    weekly: string;
    wechatPublic?: WeChatPublicConfig;
  },
  giscus: {
    repo: "vwww-droid/vw2x.github.io" as `${string}/${string}`,
    repoId: "R_kgDOPVXI-A",
    category: "Announcements",
    categoryId:
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "DIC_kwDOPVXI-M4C45-J",
  },
  navigation: {
    main: [
      { title: "Weekly", href: "/weekly" },
      { title: "GitHub", href: "https://github.com/vwww-droid" },
    ],
  },
  seo: {
    metadataBase: new URL(siteOrigin),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@xxx",
    },
  },
};
