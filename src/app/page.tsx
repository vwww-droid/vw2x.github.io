import { allBlogs } from "content-collections";
import { BlogList } from "@/components/blog/blog-list";

export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <BlogList blogs={blogs} />
    </div>
  );
}
