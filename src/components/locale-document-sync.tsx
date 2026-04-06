"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LocaleDocumentSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale =
      pathname === "/en" || pathname.startsWith("/en/") ? "en-US" : "zh-CN";
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
