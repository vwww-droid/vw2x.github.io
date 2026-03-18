"use client";

import Link from "next/link";
import { NavDesktopMenu } from "./nav-desktop-menu";
import GithubIcon from "@/components/icons/github";
import XiaohongshuIcon from "@/components/icons/xiaohongshu";
import XIcon from "@/components/icons/x";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { config } from "@/lib/config";

export function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blog/");

  const socialLinks = [
    { title: "Github", key: "github", icon: <GithubIcon /> },
    { title: "X", key: "x", icon: <XIcon /> },
    { title: "Xiaohongshu", key: "xiaohongshu", icon: <XiaohongshuIcon /> },
  ]
    .map(item => ({
      title: item.title,
      href: config.social && config.social[item.key as keyof typeof config.social],
      icon: item.icon
    }))
    .filter(link => !!link.href);

  return (
    <header className="hidden pt-4 md:block">
      <motion.div
        initial={{ maxWidth: "48rem" }}
        animate={{ maxWidth: isBlogPage ? "72rem" : "48rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn("container mx-auto flex h-16 items-center justify-between px-4", isBlogPage ? "max-w-4xl xl:max-w-6xl" : "max-w-3xl")}
      >
        {/* Desktop navigation */}
        <div>
          <NavDesktopMenu />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-8 mr-4">
          {socialLinks.map((link) => (
            <Link key={link.title} href={link.href} title={link.title}>
              {link.icon}
            </Link>
          ))}
        </div>
      </motion.div>
    </header >
  );
}
