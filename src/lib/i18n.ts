export const DEFAULT_LOCALE = "zh-CN" as const;
export const EN_LOCALE = "en-US" as const;
export const LOCALE_COOKIE = "preferred_locale";

export type Locale = typeof DEFAULT_LOCALE | typeof EN_LOCALE;

export function isEnglishLocale(value: string | null | undefined) {
  return value?.toLowerCase().startsWith("en") ?? false;
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isEnglishLocale(value) ? EN_LOCALE : DEFAULT_LOCALE;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === DEFAULT_LOCALE || value === EN_LOCALE;
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === EN_LOCALE ? DEFAULT_LOCALE : EN_LOCALE;
}

export function getLocaleLabel(locale: Locale) {
  return locale === EN_LOCALE ? "En" : "中";
}

export function isEnglishPathname(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function getLocaleFromPathname(pathname: string): Locale {
  return isEnglishPathname(pathname) ? EN_LOCALE : DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string) {
  if (!isEnglishPathname(pathname)) {
    return pathname;
  }

  const stripped = pathname.replace(/^\/en(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

export function withLocalePrefix(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);

  if (locale === EN_LOCALE) {
    return stripped === "/" ? "/en" : `/en${stripped}`;
  }

  return stripped;
}

