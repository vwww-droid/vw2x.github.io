import { MDXRemote } from "next-mdx-remote-client/rsc";
import count from "word-count";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

import { DashboardTableOfContents } from "@/components/toc";
import { components } from "@/components/mdx-components";
import GiscusComments from "@/components/giscus-comments";
import { GoToTop } from "@/components/go-to-top";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";

type BlogPostPageProps = {
  blog: {
    title: string;
    date: string;
    content: string;
    lang?: string;
  };
  locale: "zh-CN" | "en-US";
  toc: Awaited<ReturnType<typeof import("@/lib/toc").getTableOfContents>>;
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

export function BlogPostPage({ blog, locale, toc }: BlogPostPageProps) {
  const countLabel =
    locale === "en-US"
      ? `${count(blog.content)} words`
      : `${count(blog.content)} 字`;

  return (
    <main className="relative mx-auto max-w-full py-[15px] md:max-w-6xl md:py-[34px] xl:grid xl:grid-cols-[1fr_300px] xl:gap-10">
      <div className="mx-auto w-full max-w-[900px] px-4 md:px-5">
        <article className="rounded-[8px] bg-white px-5 py-5 md:px-[30px] md:py-[20px] lg:px-[80px] lg:py-[32px]">
          <header className="mb-5">
            <h1 className="font-reading-zh text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] text-[rgba(36,41,47,0.9)] md:text-[30px]">
              {blog.title}
            </h1>
            <p className="mt-3 text-[15px] leading-[1.3] text-[rgba(85,85,85,0.8)] md:text-[17px]">
              {blog.date} · {countLabel}
            </p>
          </header>

          <div className="mdx-content font-reading-zh [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2">
            <MDXRemote
              source={expandMultiBlankLines(blog.content)}
              components={components}
              options={options}
            />
          </div>
        </article>

        <div className="mt-[15px] rounded-[8px] bg-white px-5 py-5 md:mt-[30px] md:px-[30px] md:py-[24px] lg:px-[80px] lg:py-[32px]">
          <GiscusComments lang={locale} />
        </div>
      </div>

      <div className="hidden text-sm xl:block">
        <div className="sticky top-20 h-[calc(100vh-5rem)]">
          <div className="mt-8 flex h-full flex-col justify-between overflow-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <DashboardTableOfContents toc={toc} />
            <GoToTop />
          </div>
        </div>
      </div>
    </main>
  );
}
