import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/utils"
import { notFound } from "next/navigation"
import 'highlight.js/styles/github-dark.min.css'
import 'katex/dist/katex.min.css';
import { config } from "@/lib/config";
import { getBlogBySlug, getBlogsByLocale, getTranslatedBlog } from "@/lib/content";
import { BlogPostPage } from "@/components/blog/blog-post-page";

type BlogsPageProps = {
  params: Promise<{slug: string[]}>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getBlogsFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || ""
  const blog = getBlogBySlug("zh-CN", slug);

  if (!blog) {
    return null
  }

  return blog
}

export async function generateMetadata({ params }: BlogsPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    return {}
  }
  const translated = getTranslatedBlog("zh-CN", blog.translationKey);

  return {
    title: blog.title,
    description: blog.summary,
    keywords: blog.keywords,
    alternates: {
      canonical: `/blog/${blog.slug}`,
      languages: translated
        ? {
            "zh-CN": `/blog/${blog.slug}`,
            "en-US": translated.href,
          }
        : undefined,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: config.seo.openGraph.type,
      url: absoluteUrl(`/blog/${blog.slug}`),
      images: [
        {
          url: config.site.image
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: blog.title,
      description: blog.summary,
      images: [
        {
          url: config.site.image
        },
      ],
      creator: config.seo.twitter.creator,
    },
  }
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return getBlogsByLocale("zh-CN").map((blog) => ({
    slug: blog.slug.split('/'),
  }))
}

export default async function BlogPage(props: BlogsPageProps) {
  const { slug } = await props.params;
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    notFound()
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
      locale="zh-CN"
    />
  );
}
