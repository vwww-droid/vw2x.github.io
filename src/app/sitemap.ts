import type { MetadataRoute } from "next";
import { allBlogs, allWeeklies } from "content-collections";

import { config } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: config.site.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${config.site.url}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${config.site.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${config.site.url}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${config.site.url}/weekly`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${config.site.url}/en/weekly`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `${config.site.url}${blog.href}`,
    lastModified: new Date(blog.updated ?? blog.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const weeklyRoutes: MetadataRoute.Sitemap = allWeeklies.map((issue) => ({
    url: `${config.site.url}${issue.href}`,
    lastModified: new Date(issue.updated ?? issue.date),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...blogRoutes, ...weeklyRoutes];
}
