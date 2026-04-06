import { config } from "@/lib/config";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const navItems: NavItem[] = config.navigation.main.map(({ title, href }) => ({
  label: title,
  href,
  external: /^https?:\/\//.test(href),
}));
