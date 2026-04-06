import { type Metadata } from "next";
import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { getBlogsByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `${config.localeLabels.blog["zh-CN"]} | ${config.site.title}`,
  description: config.site.description["zh-CN"],
  keywords: `${config.site.title}, 博客, 文章`,
};

export default function BlogPage() {
  const blogs = getBlogsByLocale("zh-CN");

  return (
    <div className="mx-auto w-full max-w-[1040px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <BlogList blogs={blogs} />
    </div>
  );
}
