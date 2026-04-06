import { defineCollection, defineConfig } from "@content-collections/core";
import { getCollectionItemHref } from "@/lib/publication-routes";

const localeSchema = (z: any) => ({
  lang: z.enum(["zh-CN", "en-US"]).default("zh-CN"),
  translationKey: z.string().optional(),
});

function stripLocaleSegment(path: string) {
  return path.replace(/^(zh|en)\//, "");
}

const blogs = defineCollection({
  name: "blogs",
  directory: "src/content/blog",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    featured: z.boolean().optional().default(false),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    const slug = stripLocaleSegment(document._meta.path);

    return {
      ...document,
      slug,
      href: getCollectionItemHref("blog", document.lang, slug),
      translationKey: document.translationKey ?? slug,
    };
  },
});

const weekly = defineCollection({
  name: "weekly",
  directory: "src/content/weekly",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    featured: z.boolean().optional().default(false),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    issue: z.number(),
    issueLabel: z.string().optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    const slug = stripLocaleSegment(document._meta.path);

    return {
      ...document,
      slug,
      href: getCollectionItemHref("weekly", document.lang, slug),
      translationKey: document.translationKey ?? slug,
    };
  },
});

const notes = defineCollection({
  name: "notes",
  directory: "src/content/notes",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    featured: z.boolean().optional().default(false),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    const slug = stripLocaleSegment(document._meta.path);

    return {
      ...document,
      slug,
      href: getCollectionItemHref("notes", document.lang, slug),
      translationKey: document.translationKey ?? slug,
    };
  },
});

const aboutPages = defineCollection({
  name: "aboutPages",
  directory: "src/content/about",
  include: "**/*.md",
  schema: (z) => ({
    description: z.string().optional(),
    ...localeSchema(z),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: stripLocaleSegment(document._meta.path),
      href: document.lang === "en-US" ? "/en/about" : "/about",
      translationKey: document.translationKey ?? stripLocaleSegment(document._meta.path),
    };
  },
});

export default defineConfig({
  collections: [blogs, weekly, notes, aboutPages],
});
