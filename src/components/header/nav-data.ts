import { config } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { getCollectionIndexHref } from "@/lib/publication-routes";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export function getNavItems(locale: Locale): NavItem[] {
  const navItems = config.navigation.main.map(({ title, href }) => {
    if (title === "Weekly") {
      return {
        label: title,
        href: getCollectionIndexHref("weekly", locale),
        external: false,
      };
    }

    if (title === "About") {
      return {
        label: title,
        href: href === "/about" && locale === "en-US" ? "/en/about" : href,
        external: false,
      };
    }

    return {
      label: title,
      href,
      external: /^https?:\/\//.test(href),
    };
  });

  const notesHref = getCollectionIndexHref("notes", locale);
  if (!navItems.some((item) => item.label === "Notes")) {
    const weeklyIndex = navItems.findIndex((item) => item.label === "Weekly");
    navItems.splice(weeklyIndex >= 0 ? weeklyIndex + 1 : navItems.length, 0, {
      label: "Notes",
      href: notesHref,
      external: false,
    });
  }

  return navItems;
}
