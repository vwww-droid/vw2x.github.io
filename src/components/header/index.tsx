"use client";

import { NavDesktopMenu } from "./nav-desktop-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blog/");

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
      </motion.div>
    </header >
  );
}
