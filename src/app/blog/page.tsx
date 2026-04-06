import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogPage() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      <section className="mb-[clamp(1rem,3vw,2rem)] border-b border-black/5 pb-[clamp(1rem,2.5vw,1.5rem)]">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
            Blog
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
            All posts, newest first.
          </p>
        </div>
      </section>
      <BlogList blogs={blogs} />
    </div>
  );
}
