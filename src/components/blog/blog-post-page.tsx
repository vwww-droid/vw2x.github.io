import { MDXRemote } from "next-mdx-remote-client/rsc";
import count from "word-count";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

import { BlogHero } from "@/components/blog/blog-hero";
import { components } from "@/components/mdx-components";
import GiscusComments from "@/components/giscus-comments";
import type { BlogCover } from "@/lib/covers";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";
import { cn } from "@/lib/utils";

type BlogPostPageProps = {
  blog: {
    title: string;
    date: string;
    summary?: string;
    content: string;
    cover: BlogCover;
  };
  locale: "zh-CN" | "en-US";
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

const pageShellClassName = "mx-auto w-full max-w-[900px] px-4 md:px-5";
const articleSurfaceClassName =
  "bg-[rgba(255,255,255,0.9)] px-5 py-5 md:px-[30px] md:py-[24px] lg:px-[80px] lg:py-[36px]";
const commentsSurfaceClassName =
  "bg-[rgba(255,255,255,0.82)] px-5 py-5 md:px-[30px] md:py-[24px] lg:px-[80px] lg:py-[32px]";

export function BlogPostPage({ blog, locale }: BlogPostPageProps) {
  const metaLabel =
    locale === "en-US" ? `${count(blog.content)} words` : `${count(blog.content)} 字`;

  return (
    <main className="relative mx-auto max-w-full py-[15px] md:py-[34px]">
      <div className="space-y-[15px] md:space-y-[30px]">
        <BlogHero
          title={blog.title}
          date={blog.date}
          summary={blog.summary}
          metaLabel={metaLabel}
          cover={blog.cover}
          locale={locale}
          className={pageShellClassName}
        />

        <div className={pageShellClassName}>
          <article className={articleSurfaceClassName}>
            <div
              className={cn(
                "mdx-content [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2",
                locale === "zh-CN" && "font-reading-zh"
              )}
            >
              <MDXRemote
                source={expandMultiBlankLines(blog.content)}
                components={components}
                options={options}
              />
            </div>
          </article>
        </div>

        <div className={pageShellClassName}>
          <div className={commentsSurfaceClassName}>
            <GiscusComments lang={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
