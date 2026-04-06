import { config } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export function getNavItems(locale: Locale): NavItem[] {
  return config.navigation.main.map(({ title, href }) => ({
    label: title,
    href: href === "/about" && locale === "en-US" ? "/en/about" : href,
    external: /^https?:\/\//.test(href),
  }));
}
