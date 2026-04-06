import Link from "next/link";

import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";
import { formatDateCompact } from "@/lib/utils";

export type BlogWeeklyCardData = {
  slug: string;
  href: string;
  title: string;
  date: string;
  summary?: string;
  lang?: Locale;
  cover: BlogCover;
};

type BlogWeeklyCardProps = {
  blog: BlogWeeklyCardData;
  priority?: boolean;
};

export function BlogWeeklyCard({
  blog,
  priority = false,
}: BlogWeeklyCardProps) {
  return (
    <article className="group h-full">
      <Link
        href={blog.href}
        className="block h-full"
      >
        <div className="flex h-full flex-col gap-4 rounded-[24px] bg-[rgba(255,255,255,0.96)] p-3 md:gap-5 md:p-4">
          <BlogCoverImage
            cover={blog.cover}
            priority={priority}
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
            className="aspect-[1.32] w-full rounded-[18px] bg-[rgba(246,241,232,0.9)]"
            imageClassName="transition-none"
          />
          <div className="flex flex-1 flex-col gap-3 px-1 pb-1">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[rgba(85,85,85,0.72)]">
              {formatDateCompact(blog.date, blog.lang)}
            </p>
            <h2 className="text-[22px] font-semibold leading-[1.28] tracking-[-0.025em] text-[rgba(36,41,47,0.94)] md:text-[24px]">
              {blog.title}
            </h2>
            <p className="text-[15px] leading-[1.75] text-[rgba(85,85,85,0.82)]">
              {blog.summary ?? ""}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
