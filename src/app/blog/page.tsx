import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import { config } from "@/lib/config";
import { BlogList } from "@/components/blog/blog-list";

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
    <div className="mx-auto w-full max-w-4xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      <BlogList blogs={blogs} />
    </div>
  );
}


