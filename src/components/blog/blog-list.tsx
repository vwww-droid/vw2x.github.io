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
    <div className="space-y-6 md:space-y-8">
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
          <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between">
            <h2 className="text-base md:text-xl font-semibold">
              {blog.title}
            </h2>
            <span className="text-xs md:text-sm text-gray-500 shrink-0">
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
