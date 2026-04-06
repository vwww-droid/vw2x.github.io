import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github-dark.min.css";
import "katex/dist/katex.min.css";

import { SketchArrowLeft } from "@/components/icons/sketch-arrow-left";
import { components } from "@/components/mdx-components";
import { config } from "@/lib/config";
import { getAboutPageByLocale } from "@/lib/content";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = getAboutPageByLocale("en-US");
  const description = doc?.description ?? `About ${config.author.name}`;

  return {
    title: `About — ${config.site.title}`,
    description,
  };
}

export default function EnglishAboutPage() {
  const doc = getAboutPageByLocale("en-US");

  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      <nav className="mb-6 md:mb-8" aria-label="Back to posts">
        <Link
          href="/en"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&_svg]:text-gray-500 hover:[&_svg]:text-gray-800"
        >
          <SketchArrowLeft />
          Back to posts
        </Link>
      </nav>
      <div className="mdx-content [&>h2:first-child]:mt-3 [&>h3:first-child]:mt-2">
        <MDXRemote
          source={expandMultiBlankLines(doc.content)}
          components={components}
          options={mdxOptions}
        />
      </div>
    </div>
  );
}
