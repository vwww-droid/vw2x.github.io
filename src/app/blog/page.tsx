import { type Metadata } from "next";
import Link from "next/link";
import { allBlogs } from "content-collections";
import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";
import { formatPostDateLabelZh, postDateKey } from "@/lib/blog-activity-calendar";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

type BlogPageProps = {
  searchParams: Promise<{ date?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const rawDate = params.date;
  const dateParam = Array.isArray(rawDate) ? rawDate[0] : rawDate;
  const filterDate =
    typeof dateParam === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : null;

  let blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (filterDate) {
    blogs = blogs.filter((b) => postDateKey(b.date) === filterDate);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      {filterDate ? (
        <div className="mb-[clamp(1rem,2.5vw,1.5rem)] flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">
              {formatPostDateLabelZh(filterDate)}
            </span>
            {blogs.length === 0
              ? " 暂无文章"
              : ` · 共 ${blogs.length} 篇`}
          </span>
          <Link
            href="/blog"
            className="shrink-0 text-foreground underline underline-offset-4 hover:text-foreground/80"
          >
            显示全部
          </Link>
        </div>
      ) : null}
      <BlogList blogs={blogs} />
    </div>
  );
}


