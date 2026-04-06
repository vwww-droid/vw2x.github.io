import { BlogWeeklyCard, type BlogTeaser } from "@/components/blog/blog-weekly-card";

type BlogListProps = {
  blogs: BlogTeaser[];
};

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
