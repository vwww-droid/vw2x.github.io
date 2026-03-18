import { allBlogs } from "content-collections";
import Link from "next/link";
import { config } from "@/lib/config";
import { BlogList } from "@/components/blog/blog-list";

export default function Home() {
  const blogs = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const socialLinks = [
    { name: "赞赏", key: "buyMeACoffee" },
    { name: "X", key: "x" },
    { name: "小红书", key: "xiaohongshu" },
    { name: "微信公众号", key: "wechat" },
  ]
    .map(item => ({
      name: item.name,
      href: config.social && config.social[item.key as keyof typeof config.social]
    }))
    .filter(link => !!link.href);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
      <div className="mb-10 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center">{config.site.title}</h1>
        <p className="text-sm md:text-base text-gray-600 text-center">As tiny as it is, there is a difference.</p>
        
        {socialLinks.length > 0 && (
          <div className="flex space-x-2 text-sm md:text-base text-gray-600">
            {socialLinks.map((link, index) => (
              <div key={link.name} className="flex items-center">
                {index > 0 && <span className="mx-1">·</span>}
                <Link href={link.href} className="underline underline-offset-4">
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <BlogList blogs={blogs} />
    </div>
  );
}
