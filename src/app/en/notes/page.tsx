import type { Metadata } from "next";

import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { getBlogsByLocale } from "@/lib/content";

export const metadata: Metadata = {
  title: `vw2x Notes | ${config.site.title}`,
  description: "The bilingual notes archive for vw2x",
  keywords: `${config.site.title}, Notes, quick notes`,
};

export default function NotesPage() {
  const blogs = getBlogsByLocale("en-US");

  return (
    <div className="mx-auto w-full max-w-[1338px] px-4 py-4 sm:px-3 md:px-0 md:py-8">
      <BlogList blogs={blogs} />
    </div>
  );
}
