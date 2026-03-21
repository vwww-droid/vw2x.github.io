import { allBlogs } from "content-collections";
import { config } from "@/lib/config";
import { BlogList } from "@/components/blog/blog-list";

export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-[clamp(0.75rem,3.5vw,1.25rem)] py-[clamp(1rem,5vw,2.75rem)]">
      <div className="mb-[clamp(2.5rem,7vw,5rem)] space-y-[clamp(0.75rem,2vw,1.25rem)]">
        <h1 className="text-2xl md:text-4xl font-bold text-center">{config.site.title}</h1>
        <p className="text-sm md:text-base text-gray-600 text-center">As tiny as it is, there is a difference.</p>
      </div>

      <BlogList blogs={blogs} />
    </div>
  );
}
