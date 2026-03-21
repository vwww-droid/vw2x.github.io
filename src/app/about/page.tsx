import { allAboutPages } from "content-collections";
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
import { components } from "@/components/mdx-components";
import { expandMultiBlankLines } from "@/lib/mdx-expand-blank-lines";
import { SketchArrowLeft } from "@/components/icons/sketch-arrow-left";
import { config } from "@/lib/config";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
  },
};

function getAboutDocument() {
  const sorted = [...allAboutPages].sort((a, b) =>
    a._meta.path.localeCompare(b._meta.path)
  );
  return sorted[0] ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = getAboutDocument();
  const description = doc?.description ?? `关于 ${config.author.name}`;
  return {
    title: `关于 — ${config.site.title}`,
    description,
  };
}

export default function AboutPage() {
  const doc = getAboutDocument();
  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      <nav className="mb-6 md:mb-8" aria-label="Back to posts">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&_svg]:text-gray-500 hover:[&_svg]:text-gray-800"
        >
          <SketchArrowLeft />
          文章列表
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
