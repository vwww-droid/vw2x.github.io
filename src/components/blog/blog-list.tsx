import { BlogWeeklyCard, type BlogTeaser } from "@/components/blog/blog-weekly-card";

type BlogListProps = {
  blogs: BlogTeaser[];
};

export function BlogList({ blogs }: BlogListProps) {
  const [featuredBlog, ...restBlogs] = blogs;

  return (
    <div className="space-y-10 md:space-y-12">
      {featuredBlog ? (
        <BlogWeeklyCard
          blog={featuredBlog}
          featured
          priority
        />
      ) : null}
      {restBlogs.length > 0 ? (
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 md:gap-y-12">
          {restBlogs.map((blog) => (
            <BlogWeeklyCard
              key={blog.href}
              blog={blog}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
