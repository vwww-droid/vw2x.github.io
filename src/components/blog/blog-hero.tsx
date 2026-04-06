import { BlogCoverImage } from "@/components/blog/blog-cover-image";
import type { BlogCover } from "@/lib/covers";
import { cn, formatDateCompact } from "@/lib/utils";

type BlogHeroProps = {
  title: string;
  date: string;
  summary?: string;
  metaLabel: string;
  cover: BlogCover;
  locale: "zh-CN" | "en-US";
  className?: string;
};

export function BlogHero({
  title,
  date,
  summary,
  metaLabel,
  cover,
  locale,
  className,
}: BlogHeroProps) {
  return (
    <header className={className}>
      <div className="rounded-[28px] bg-[rgba(255,255,255,0.92)] p-3 md:p-4">
        <BlogCoverImage
          cover={cover}
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="aspect-[1.32] w-full rounded-[22px] bg-[rgba(246,241,232,0.92)] md:aspect-[1.72]"
          imageClassName="transition-none"
        />
        <div className="px-1 pb-2 pt-5 md:px-2 md:pb-3 md:pt-6">
          <p className="text-[13px] uppercase tracking-[0.12em] text-[rgba(85,85,85,0.72)]">
            {formatDateCompact(date, locale)} · {metaLabel}
          </p>
          <h1
            className={cn(
              "mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.04em] text-[rgba(36,41,47,0.95)] md:text-[42px]",
              locale === "zh-CN" && "font-reading-zh"
            )}
          >
            {title}
          </h1>
          {summary ? (
            <p
              className={cn(
                "mt-4 max-w-[42rem] text-[16px] leading-[1.85] text-[rgba(85,85,85,0.84)] md:text-[18px]",
                locale === "zh-CN" && "font-reading-zh"
              )}
            >
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
