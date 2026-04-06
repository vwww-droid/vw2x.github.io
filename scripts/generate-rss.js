import { readdir, readFile } from "fs/promises";
import { join, relative } from "path";
import { promises as fsPromises } from "fs";
import matter from "gray-matter";
import { Feed } from "feed";
import { marked } from "marked";

const BASE_URL = "https://vw2x.vercel.app";
const AUTHOR = {
  name: "vw2x",
  email: "vwvw2025@outlook.com",
  link: BASE_URL,
};

async function scanMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await scanMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      const content = await readFile(fullPath, "utf-8");
      const { data, content: markdown } = matter(content);
      const relativePath = relative(join(process.cwd(), "src/content/blog"), fullPath)
        .replace(/\\/g, "/");
      const [localeSegment, ...slugParts] = relativePath.split("/");
      const slug = slugParts.join("/").replace(/\.md$/, "");
      const lang = data.lang === "en-US" || localeSegment === "en" ? "en-US" : "zh-CN";
      const url =
        lang === "en-US"
          ? `${BASE_URL}/en/blog/${slug}`
          : `${BASE_URL}/blog/${slug}`;

      files.push({
        ...data,
        lang,
        slug,
        content: markdown,
        url,
        date: new Date(data.date),
        updated: data.updated ? new Date(data.updated) : new Date(data.date),
      });
    }
  }

  return files;
}

async function generateRSSFeed() {
  const contentDir = join(process.cwd(), "src/content/blog");

  try {
    const posts = await scanMarkdownFiles(contentDir);
    posts.sort((a, b) => b.date - a.date);

    const feed = new Feed({
      title: "vw2x",
      description: "Notes on learning, building, and thinking",
      id: BASE_URL,
      link: BASE_URL,
      language: "zh-CN",
      image: `${BASE_URL}/favicon.png`,
      favicon: `${BASE_URL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, vw2x`,
      updated: new Date(),
      generator: "Feed for Node.js",
      feedLinks: {
        rss2: `${BASE_URL}/rss.xml`,
        json: `${BASE_URL}/feed.json`,
        atom: `${BASE_URL}/atom.xml`,
      },
      author: AUTHOR,
    });

    for (const post of posts) {
      const htmlContent = marked(post.content);

      feed.addItem({
        title: post.title,
        id: post.url,
        link: post.url,
        description: post.summary,
        content: htmlContent,
        author: [AUTHOR],
        date: post.date,
        updated: post.updated,
      });
    }

    await fsPromises.writeFile("./public/rss.xml", feed.rss2());
    await fsPromises.writeFile("./public/index.xml", feed.rss2());
    await fsPromises.writeFile("./public/atom.xml", feed.atom1());
    await fsPromises.writeFile("./public/feed.json", feed.json1());

      console.log(`Generated RSS feeds with ${posts.length} items`);
  } catch (error) {
    console.error("Error generating RSS feeds:", error);
  }
}

generateRSSFeed().catch(console.error); 
