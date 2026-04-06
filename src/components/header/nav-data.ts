import { config } from "@/lib/config";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  {
    label: "Weekly",
    href: config.social.weekly,
    external: true,
  },
  {
    label: "GitHub",
    href: config.social.github,
    external: true,
  },
  {
    label: "About",
    href: "/about",
  },
];
