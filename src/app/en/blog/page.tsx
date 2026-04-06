import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { getBlogsByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `${config.localeLabels.blog["en-US"]} | ${config.site.title}`,
  description: config.site.description["en-US"],
  keywords: `${config.site.title}, blog, engineering notes`,
};

export default function EnglishBlogIndexPage() {
  const blogs = getBlogsByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8">
      <BlogList blogs={blogs} />
    </div>
  );
}
