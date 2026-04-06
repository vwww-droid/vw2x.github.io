import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { getBlogsByLocale } from "@/lib/content";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description["en-US"],
};

export default function EnglishHomePage() {
  const blogs = getBlogsByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8">
      <BlogList blogs={blogs} />
    </div>
  );
}
