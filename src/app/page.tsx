import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { getBlogsByLocale } from "@/lib/content";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description["zh-CN"],
};

export default function Home() {
  const blogs = getBlogsByLocale("zh-CN");

  return (
    <div className="py-[15px] md:py-[34px]">
      <section className="mx-auto mb-[15px] w-full max-w-[760px] px-4 md:mb-[24px] md:px-5">
        <div className="border-b border-[#d9d9d9] pb-6 md:pb-8">
          <p className="text-[15px] leading-[1.6] text-[rgba(85,85,85,0.8)] md:text-[17px]">
            {config.site.tagline}
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1040px] px-4 md:px-5">
        <BlogList blogs={blogs} />
      </section>
    </div>
  );
}
