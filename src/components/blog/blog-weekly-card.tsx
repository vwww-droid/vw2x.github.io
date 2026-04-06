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
    <article className="h-full min-w-0">
      <Link
        href={blog.href}
        className="card-content mx-auto flex h-full w-full min-w-0 flex-col justify-center overflow-hidden rounded-lg bg-white pb-3 shadow-md"
      >
        <BlogCoverImage
          cover={blog.cover}
          priority={priority}
          sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-56 w-full rounded-t-lg bg-[rgba(246,241,232,0.9)] sm:h-52 md:h-48"
          imageClassName="transition-none"
        />
        <div className="flex w-full min-w-0 items-center justify-between gap-3 px-3 pt-3 leading-tight">
          <h2 className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-[rgba(36,41,47,0.96)] md:text-[16px]">
            {blog.title}
          </h2>
          <p className="shrink-0 text-base text-[rgba(85,85,85,0.82)] md:text-[15px]">
            {formatDateWeekly(blog.date)}
          </p>
        </div>
        <p className="line-clamp-2 h-14 w-full overflow-hidden px-3 pt-2 text-base leading-[1.55] text-[rgba(85,85,85,0.86)] md:h-12 md:text-[15px]">
          {blog.summary ?? ""}
        </p>
      </Link>
    </article>
  );
}
