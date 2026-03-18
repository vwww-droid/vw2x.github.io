import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogPage() {
  const blogs = allBlogs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
      <div className="space-y-6 md:space-y-8">
        {blogs.map((blog: any) => (
          <article key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <div className="flex flex-col space-y-1 md:space-y-1.5">
                <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-base md:text-xl font-semibold underline underline-offset-4">
                    {blog.title}
                  </h2>
                  <span className="text-xs md:text-sm text-gray-500 shrink-0">
                    {formatDate(blog.date)} · {count(blog.content)} 字
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                  {blog.summary}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}


