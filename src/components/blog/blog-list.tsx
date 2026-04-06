import Link from "next/link";
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
    <div className="space-y-[clamp(1rem,2.75vw,1.75rem)]">
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
    <article className="group">
      <Link
        href={`/blog/${blog.slug}`}
        className="block rounded-none py-[clamp(0.25rem,0.8vw,0.5rem)] transition-colors hover:text-foreground/80"
      >
        <div className="max-w-3xl space-y-2">
          <h2 className="text-lg font-medium leading-snug tracking-tight text-foreground md:text-2xl md:leading-tight">
            {blog.title}
          </h2>
          <p className="text-xs leading-5 text-muted-foreground/70 md:text-sm md:leading-6">
            {formatDate(blog.date)}
          </p>
          <p className="text-sm leading-6 text-muted-foreground md:text-[1.05rem] md:leading-7">
            {blog.summary ?? ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
