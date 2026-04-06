import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogPage() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <BlogList blogs={blogs} />
    </div>
  );
}
