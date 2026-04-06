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
  "min-w-0 overflow-hidden bg-white px-[15px] py-5 md:rounded-[8px] md:px-[36px] md:py-5 lg:px-[88px] lg:py-5";
const sectionStackClassName = "space-y-[15px] md:space-y-[30px]";
const postFlowClassName = "space-y-3 md:space-y-[30px]";

export function BlogPostPage({ blog, locale }: BlogPostPageProps) {
  const metaLabel =
    locale === "en-US" ? `${count(blog.content)} words` : `${count(blog.content)} 字`;

  return (
    <main className="relative mx-auto max-w-full py-[15px] md:py-[34px]">
      <div className={sectionStackClassName}>
        <BlogHero
          title={blog.title}
          date={blog.date}
          summary={blog.summary}
          metaLabel={metaLabel}
          cover={blog.cover}
          locale={locale}
          className={pageShellClassName}
        />

        <div className={postFlowClassName}>
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
            <section aria-labelledby="comments-heading" className={commentsSurfaceClassName}>
              <h2 id="comments-heading" className="sr-only">
                {locale === "en-US" ? "Comments" : "评论"}
              </h2>
              <GiscusComments lang={locale} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
