"use client";

import { NavDesktopMenu } from "./nav-desktop-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");

  return (
    <header className="hidden pt-4 md:block">
      <motion.div
        initial={{ maxWidth: "56rem" }}
        animate={{ maxWidth: isBlogPage ? "72rem" : "56rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "container mx-auto flex h-16 items-center justify-between px-[clamp(0.75rem,3.5vw,1.25rem)]",
          isBlogPage ? "max-w-4xl xl:max-w-6xl" : "max-w-4xl"
        )}
      >
        {/* Desktop navigation */}
        <div>
          <NavDesktopMenu />
        </div>
      </motion.div>
    </header >
  );
}
