import { BlogWeeklyCard, type BlogWeeklyCardData } from "@/components/blog/blog-weekly-card";
import type { BlogCover } from "@/lib/covers";
import type { Locale } from "@/lib/i18n";

export type BlogListItemData = {
  slug: string;
  href: string;
  title: string;
  date: string;
  content: string;
  summary?: string;
  lang?: Locale;
  cover: BlogCover;
};

type BlogListProps = {
  blogs: BlogListItemData[];
};

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 md:gap-y-12 xl:grid-cols-3">
      {blogs.map((blog, index) => (
        <BlogListItem
          key={blog.slug}
          blog={blog}
          priority={index < 3}
        />
      ))}
    </div>
  );
}

type BlogListItemProps = {
  blog: BlogWeeklyCardData;
  priority?: boolean;
};

function BlogListItem({ blog, priority = false }: BlogListItemProps) {
  return <BlogWeeklyCard blog={blog} priority={priority} />;
}
