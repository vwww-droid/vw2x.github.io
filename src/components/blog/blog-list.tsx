import Link from "next/link";
import { formatDateCompact } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export type BlogListItemData = {
  slug: string;
  href: string;
  title: string;
  date: string;
  content: string;
  summary?: string;
  lang?: Locale;
};

type BlogListProps = {
  blogs: BlogListItemData[];
};

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-[15px] md:space-y-[30px]">
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
    <article className="rounded-[8px] bg-white px-5 py-5 md:px-[36px] md:py-[26px] lg:px-[50px] lg:py-[30px]">
      <Link
        href={blog.href}
        className="block"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] font-semibold leading-[1.35] tracking-[-0.02em] text-[rgba(36,41,47,0.9)] md:text-[26px]">
              {blog.title}
            </h2>
          </div>
          <p className="shrink-0 text-[15px] leading-[1.3] text-[rgba(85,85,85,0.8)] md:pt-1 md:text-[17px]">
            {formatDateCompact(blog.date, blog.lang)}
          </p>
        </div>
        <p className="mt-3 text-[17px] leading-[1.72] text-[rgba(85,85,85,0.8)]">
            {blog.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}
