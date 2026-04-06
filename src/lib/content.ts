import { allAboutPages, allBlogs } from "content-collections";
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

type BlogRecord = (typeof allBlogs)[number];

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

function addResolvedCover(blog: BlogRecord): BlogWithCover {
  const { cover: ignoredCover, coverAlt: ignoredCoverAlt, ...rest } = blog;
  void ignoredCover;
  void ignoredCoverAlt;

  return {
    ...rest,
    cover: getResolvedBlogCover(blog),
  };
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
  return locale === EN_LOCALE ? "/en/blog" : "/blog";
}

export function getBlogsByLocale(locale: Locale) {
  return sortByDateDesc(
    allBlogs.filter((blog) => getDocumentLocale(blog) === locale).map(addResolvedCover)
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
  const source = locale
    ? getBlogsByLocale(locale)
    : sortByDateDesc(allBlogs).map(addResolvedCover);

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

  return {
    href: getHomeHref(nextLocale),
    label: getLocaleLabel(nextLocale),
    locale: nextLocale,
  };
}
