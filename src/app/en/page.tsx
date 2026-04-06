import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { getBlogsByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description["en-US"],
};

export default function EnglishHomePage() {
  const blogs = getBlogsByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <section className="mb-[15px] border-b border-[#d9d9d9] pb-6 md:mb-[24px] md:pb-8">
        <p className="text-[15px] leading-[1.6] text-[rgba(85,85,85,0.8)] md:text-[17px]">
          {config.site.tagline}
        </p>
      </section>
      <BlogList blogs={blogs} />
    </div>
  );
}
