import { allBlogs } from "content-collections";
import { BlogList } from "@/components/blog/blog-list";
import { config } from "@/lib/config";

export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-[15px] md:px-5 md:py-[34px]">
      <section className="mb-[15px] border-b border-[#d9d9d9] pb-7 md:mb-[30px] md:pb-10">
        <h1 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-[rgba(36,41,47,0.9)] md:text-[34px]">
          {config.site.title}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-[rgba(85,85,85,0.8)] md:text-[17px]">
          {config.site.tagline}
        </p>
      </section>
      <BlogList blogs={blogs} />
    </div>
  );
}
