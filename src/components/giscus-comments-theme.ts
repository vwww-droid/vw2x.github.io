export const GISCUS_LIGHT_THEME_PATH = "/styles/giscus-light.css";
export const GISCUS_DARK_THEME_PATH = "/styles/giscus-dark.css";

export type GiscusDocumentMode = "light" | "dark";
export type GiscusLocale = "zh-CN" | "en-US";

export function getDocumentModeFromClassName(
  className: string,
): GiscusDocumentMode {
  return className.split(/\s+/).includes("dark") ? "dark" : "light";
}

export function getGiscusLang(locale: GiscusLocale) {
  return locale === "en-US" ? "en" : "zh-CN";
}

export function getGiscusThemeUrl(origin: string, mode: GiscusDocumentMode) {
  const themePath =
    mode === "dark" ? GISCUS_DARK_THEME_PATH : GISCUS_LIGHT_THEME_PATH;

  return `${origin}${themePath}`;
}

export function getGiscusThemeMessage(theme: string) {
  return {
    giscus: {
      setConfig: {
        theme,
      },
    },
  };
}
