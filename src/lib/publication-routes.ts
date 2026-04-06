import type { Locale } from "@/lib/i18n";

export type CollectionDomain = "blog" | "weekly" | "notes";

export function getCollectionIndexHref(domain: CollectionDomain, locale: Locale) {
  return locale === "en-US" ? `/en/${domain}` : `/${domain}`;
}

export function getCollectionItemHref(
  domain: CollectionDomain,
  locale: Locale,
  slug: string,
) {
  return `${getCollectionIndexHref(domain, locale)}/${slug}`;
}
