import { BlogWeeklyCard, type BlogTeaser } from "@/components/blog/blog-weekly-card";

type BlogListProps = {
  blogs: BlogTeaser[];
};

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 [&>*]:min-w-0 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
      {blogs.map((blog, index) => (
        <BlogWeeklyCard
          key={blog.href}
          blog={blog}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
