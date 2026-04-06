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
    <div className="mx-auto w-full max-w-[1180px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <BlogList blogs={blogs} />
    </div>
  );
}
