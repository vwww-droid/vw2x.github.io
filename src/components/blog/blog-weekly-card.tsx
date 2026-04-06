import Link from "next/link";

import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";
import { formatDateWeekly } from "@/lib/utils";

export type BlogTeaser = {
  href: string;
  title: string;
  date: string;
  summary?: string;
  lang?: Locale;
  cover: BlogCover;
};

type BlogWeeklyCardProps = {
  blog: BlogTeaser;
  priority?: boolean;
};

export function BlogWeeklyCard({
  blog,
  priority = false,
}: BlogWeeklyCardProps) {
  return (
    <article className="h-full">
      <Link
        href={blog.href}
        className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-white pb-3 shadow-[0_2px_12px_rgba(15,23,42,0.08)]"
      >
        <BlogCoverImage
          cover={blog.cover}
          priority={priority}
          sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-[5/3] w-full rounded-t-[12px] bg-[rgba(246,241,232,0.9)]"
          imageClassName="transition-none"
        />
        <div className="flex w-full items-center justify-between gap-3 px-4 pt-3 leading-tight">
          <h2 className="min-w-0 flex-1 truncate text-[18px] font-semibold text-[rgba(36,41,47,0.96)] md:text-[16px]">
            {blog.title}
          </h2>
          <p className="shrink-0 text-[18px] text-[rgba(85,85,85,0.82)] md:text-[15px]">
            {formatDateWeekly(blog.date)}
          </p>
        </div>
        <p className="line-clamp-2 px-4 pt-2 text-[18px] leading-[1.55] text-[rgba(85,85,85,0.86)] md:min-h-[3rem] md:text-[15px]">
          {blog.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}
