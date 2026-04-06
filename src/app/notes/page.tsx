import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { getBlogsByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x 笔记 | ${config.site.title}`,
  description: "vw2x 的双语笔记归档",
  keywords: `${config.site.title}, 笔记, Notes`,
};

export default function NotesPage() {
  const blogs = getBlogsByLocale("zh-CN");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8">
      <BlogList blogs={blogs} />
    </div>
  );
}
