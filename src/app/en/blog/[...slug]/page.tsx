import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostPage } from "@/components/blog/blog-post-page";
import { config } from "@/lib/config";
import {
  getBlogBySlug,
  getBlogsByLocale,
  getTranslatedBlog,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

type BlogsPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getBlogFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || "";
  return getBlogBySlug("en-US", slug);
}

export async function generateMetadata({
  params,
}: BlogsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogFromParams(slug);

  if (!blog) {
    return {};
  }

  const translated = getTranslatedBlog("en-US", blog.translationKey);

  return {
    title: blog.title,
    description: blog.summary,
    keywords: blog.keywords,
    alternates: {
      canonical: `/en/blog/${blog.slug}`,
      languages: translated
        ? {
            "zh-CN": translated.href,
            "en-US": `/en/blog/${blog.slug}`,
          }
        : undefined,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/en/blog/${blog.slug}`),
      images: [{ url: config.site.image }],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: blog.title,
      description: blog.summary,
      images: [{ url: config.site.image }],
      creator: config.seo.twitter.creator,
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return getBlogsByLocale("en-US").map((blog) => ({
    slug: blog.slug.split("/"),
  }));
}

export default async function EnglishBlogPage(props: BlogsPageProps) {
  const { slug } = await props.params;
  const blog = await getBlogFromParams(slug);

  if (!blog) {
    notFound();
  }
  return (
    <BlogPostPage
      blog={{
        title: blog.title,
        date: blog.date,
        summary: blog.summary,
        content: blog.content,
        lang: blog.lang,
        cover: blog.cover,
      }}
      locale="en-US"
    />
  );
}
