export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  {
    label: "Weekly",
    href: "https://weekly.vw2x.com",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/vwww-droid",
    external: true,
  },
  {
    label: "About",
    href: "/about",
  },
];
