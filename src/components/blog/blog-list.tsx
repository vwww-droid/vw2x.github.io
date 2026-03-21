import Link from "next/link";
import count from "word-count";
import { formatDate } from "@/lib/utils";

export type BlogListItemData = {
  slug: string;
  title: string;
  date: string;
  content: string;
  summary?: string;
};

type BlogListProps = {
  blogs: BlogListItemData[];
};

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-[clamp(1rem,2.5vw,1.625rem)]">
      {blogs.map(blog => (
        <BlogListItem key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}

type BlogListItemProps = {
  blog: BlogListItemData;
};

function BlogListItem({ blog }: BlogListItemProps) {
  return (
    <article>
      <Link href={`/blog/${blog.slug}`}>
        <div className="flex flex-col space-y-1 md:space-y-1.5">
          <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-x-[clamp(1rem,3.5vw,2.25rem)]">
            <h2 className="min-w-0 flex-1 text-base md:text-xl font-semibold [text-wrap:pretty]">
              {blog.title}
            </h2>
            <span className="text-xs md:text-sm text-gray-500 shrink-0 md:text-right">
              {formatDate(blog.date)} · {count(blog.content)} 字
            </span>
          </div>
          <p className="text-sm md:text-base text-gray-600 line-clamp-2">
            {blog.summary ?? ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
