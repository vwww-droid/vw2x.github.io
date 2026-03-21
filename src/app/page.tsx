import { allBlogs } from "content-collections";
import { config } from "@/lib/config";
import { BlogList } from "@/components/blog/blog-list";

export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
      <div className="mb-10 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center">{config.site.title}</h1>
        <p className="text-sm md:text-base text-gray-600 text-center">As tiny as it is, there is a difference.</p>
      </div>

      <BlogList blogs={blogs} />
    </div>
  );
}
