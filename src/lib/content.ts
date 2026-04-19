import { allAboutPages, allBlogs, allNotes, allWeeklies } from "content-collections";
import type { Locale } from "@/lib/i18n";
import { resolveBlogCover, type BlogCover } from "@/lib/covers";
import {
  DEFAULT_LOCALE,
  EN_LOCALE,
  getLocaleFromPathname,
  getLocaleLabel,
  getOppositeLocale,
  stripLocalePrefix,
} from "@/lib/i18n";
import { getCollectionIndexHref } from "@/lib/publication-routes";

type BlogRecord = (typeof allBlogs)[number];
type WeeklyRecord = (typeof allWeeklies)[number];
type NoteRecord = (typeof allNotes)[number];

export type SearchDocument = {
  title: string;
  url: string;
  date: string;
  summary: string;
  content: string;
  lang: Locale;
  translationKey: string;
  cover: BlogCover;
};

type BlogWithCover = Omit<BlogRecord, "cover" | "coverAlt"> & {
  cover: BlogCover;
};
type WeeklyWithCover = Omit<WeeklyRecord, "cover" | "coverAlt"> & {
  cover: BlogCover;
};
type NoteWithCover = Omit<NoteRecord, "cover" | "coverAlt"> & {
  cover: BlogCover;
};

export type LanguageSwitchTarget = {
  href: string;
  label: string;
  locale: Locale;
};

function sortByDateDesc<T extends { date: string }>(items: readonly T[]) {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function sortByPathAsc<T extends { slug: string }>(items: readonly T[]) {
  return [...items].sort((a, b) => a.slug.localeCompare(b.slug));
}

function getDocumentLocale(document: { lang?: string | null }) {
  return document.lang === EN_LOCALE ? EN_LOCALE : DEFAULT_LOCALE;
}

function getDocumentTranslationKey(document: {
  translationKey?: string | null;
  slug?: string;
}) {
  return document.translationKey ?? document.slug ?? "";
}

function getResolvedBlogCover(blog: BlogRecord) {
  return resolveBlogCover({
    title: blog.title,
    translationKey: getDocumentTranslationKey(blog),
    cover: blog.cover,
    coverAlt: blog.coverAlt,
  });
}

function extractFirstImageSource(content: string) {
  const htmlImageMatch = content.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (htmlImageMatch?.[1]) {
    return htmlImageMatch[1];
  }

  const markdownImageMatch = content.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
  if (markdownImageMatch?.[1]) {
    return markdownImageMatch[1];
  }

  return undefined;
}

function getResolvedWeeklyCover(issue: WeeklyRecord): BlogCover {
  const explicitOrGenerated = resolveBlogCover({
    title: issue.title,
    translationKey: getDocumentTranslationKey(issue),
    cover: issue.cover,
    coverAlt: issue.coverAlt,
  });

  if (explicitOrGenerated.source !== "none") {
    return explicitOrGenerated;
  }

  const extractedSource = extractFirstImageSource(issue.content);
  if (!extractedSource) {
    return { source: "none" };
  }

  return {
    source: "generated",
    src: extractedSource,
    alt: issue.coverAlt?.trim() || issue.title,
  };
}

function normalizeBlog(blog: BlogRecord): BlogWithCover {
  const normalizedBlog = {
    ...blog,
    cover: getResolvedBlogCover(blog),
  };

  delete normalizedBlog.coverAlt;

  return normalizedBlog as BlogWithCover;
}

function normalizeWeekly(issue: WeeklyRecord): WeeklyWithCover {
  const normalizedIssue = {
    ...issue,
    cover: getResolvedWeeklyCover(issue),
  };

  delete normalizedIssue.coverAlt;

  return normalizedIssue as WeeklyWithCover;
}

function normalizeNote(note: NoteRecord): NoteWithCover {
  const normalizedNote = {
    ...note,
    cover: getResolvedBlogCover(note),
  };

  delete normalizedNote.coverAlt;

  return normalizedNote as NoteWithCover;
}

function toSearchableContent(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getHomeHref(locale: Locale) {
  return locale === EN_LOCALE ? "/en" : "/";
}

function getBlogIndexHref(locale: Locale) {
  return getCollectionIndexHref("blog", locale);
}

function getWeeklyIndexHref(locale: Locale) {
  return getCollectionIndexHref("weekly", locale);
}

function getNotesIndexHref(locale: Locale) {
  return getCollectionIndexHref("notes", locale);
}

export function getBlogsByLocale(locale: Locale) {
  return sortByDateDesc(
    allBlogs.filter((blog) => getDocumentLocale(blog) === locale).map(normalizeBlog)
  );
}

export function getBlogBySlug(locale: Locale, slug: string) {
  return getBlogsByLocale(locale).find((blog) => blog.slug === slug) ?? null;
}

export function getTranslatedBlog(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getBlogsByLocale(oppositeLocale).find(
      (blog) => getDocumentTranslationKey(blog) === translationKey
    ) ?? null
  );
}

export function getWeeklyIssuesByLocale(locale: Locale) {
  return sortByDateDesc(
    allWeeklies.filter((issue) => getDocumentLocale(issue) === locale).map(normalizeWeekly)
  );
}

export function getWeeklyIssueBySlug(locale: Locale, slug: string) {
  return getWeeklyIssuesByLocale(locale).find((issue) => issue.slug === slug) ?? null;
}

export function getTranslatedWeeklyIssue(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getWeeklyIssuesByLocale(oppositeLocale).find(
      (issue) => getDocumentTranslationKey(issue) === translationKey
    ) ?? null
  );
}

export function getNotesByLocale(locale: Locale) {
  return sortByDateDesc(
    allNotes.filter((note) => getDocumentLocale(note) === locale).map(normalizeNote)
  );
}

export function getNoteBySlug(locale: Locale, slug: string) {
  return getNotesByLocale(locale).find((note) => note.slug === slug) ?? null;
}

export function getTranslatedNote(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getNotesByLocale(oppositeLocale).find(
      (note) => getDocumentTranslationKey(note) === translationKey
    ) ?? null
  );
}

export function getAboutPagesByLocale(locale: Locale) {
  return sortByPathAsc(
    allAboutPages.filter((page) => getDocumentLocale(page) === locale)
  );
}

export function getAboutPageByLocale(locale: Locale) {
  return getAboutPagesByLocale(locale)[0] ?? null;
}

export function getTranslatedAboutPage(locale: Locale, translationKey: string) {
  const oppositeLocale = getOppositeLocale(locale);
  return (
    getAboutPagesByLocale(oppositeLocale).find(
      (page) => getDocumentTranslationKey(page) === translationKey
    ) ?? null
  );
}

export function getSearchDocuments(locale?: Locale): SearchDocument[] {
  const source = sortByDateDesc([
    ...(locale ? getBlogsByLocale(locale) : sortByDateDesc(allBlogs).map(normalizeBlog)),
    ...(locale
      ? getWeeklyIssuesByLocale(locale)
      : sortByDateDesc(allWeeklies).map(normalizeWeekly)),
  ]);

  return source.map((blog) => {
    const blogLocale = getDocumentLocale(blog);
    const translationKey = getDocumentTranslationKey(blog);

    return {
      title: blog.title,
      url: blog.href,
      date: blog.date,
      summary: blog.summary ?? "",
      content: toSearchableContent(blog.content).slice(0, 1200),
      lang: blogLocale,
      translationKey,
      cover: blog.cover,
    };
  });
}

export function getSearchDocumentsByLocale(locale: Locale) {
  return getSearchDocuments(locale);
}

export function getLanguageSwitchTarget(pathname: string): LanguageSwitchTarget {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const locale = getLocaleFromPathname(normalizedPathname);
  const nextLocale = getOppositeLocale(locale);
  const relativePathname = stripLocalePrefix(normalizedPathname);

  if (relativePathname === "/") {
    return {
      href: getHomeHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  if (relativePathname === "/about") {
    const current = getAboutPageByLocale(locale);
    const translated = current
      ? getTranslatedAboutPage(locale, getDocumentTranslationKey(current))
      : null;

    return {
      href: translated?.href ?? getHomeHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  if (relativePathname === "/blog") {
    return {
      href: getBlogIndexHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  if (relativePathname === "/weekly") {
    return {
      href: getWeeklyIndexHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  if (relativePathname === "/notes") {
    return {
      href: getNotesIndexHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  const blogSlug = relativePathname.match(/^\/blog\/(.+)$/)?.[1];
  if (blogSlug) {
    const current = getBlogBySlug(locale, blogSlug);
    const translated = current
      ? getTranslatedBlog(locale, getDocumentTranslationKey(current))
      : null;

    return {
      href: translated?.href ?? getHomeHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  const weeklySlug = relativePathname.match(/^\/weekly\/(.+)$/)?.[1];
  if (weeklySlug) {
    const current = getWeeklyIssueBySlug(locale, weeklySlug);
    const translated = current
      ? getTranslatedWeeklyIssue(locale, getDocumentTranslationKey(current))
      : null;

    return {
      href: translated?.href ?? getWeeklyIndexHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  const noteSlug = relativePathname.match(/^\/notes\/(.+)$/)?.[1];
  if (noteSlug) {
    const current = getNoteBySlug(locale, noteSlug);
    const translated = current
      ? getTranslatedNote(locale, getDocumentTranslationKey(current))
      : null;

    return {
      href: translated?.href ?? getNotesIndexHref(nextLocale),
      label: getLocaleLabel(nextLocale),
      locale: nextLocale,
    };
  }

  return {
    href: getHomeHref(nextLocale),
    label: getLocaleLabel(nextLocale),
    locale: nextLocale,
  };
}
