import type { Metadata } from "next";

import "./globals.css";
import { Header } from "@/components/header";
import { config } from "@/lib/config";
import { LocaleDocumentSync } from "@/components/locale-document-sync";

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description["zh-CN"],
  keywords: config.site.keywords,
  metadataBase: config.seo.metadataBase,
  alternates: config.seo.alternates,
  openGraph: {
    url: config.site.url,
    type: config.seo.openGraph.type,
    title: config.site.title,
    description: config.site.description["zh-CN"],
    images: [
      { url: config.site.image }
    ]
  },
  twitter: {
    site: config.site.url,
    card: config.seo.twitter.card,
    title: config.site.title,
    description: config.site.description["zh-CN"],
    images: [
      { url: config.site.image }
    ]
  },
  manifest: config.site.manifest,
  appleWebApp: {
    title: config.site.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://tw93.fun/css/jinkai.css?v=20260403152924" />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml" />
        <link rel="alternate" type="application/json" title="JSON" href="/feed.json" />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <LocaleDocumentSync />
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
