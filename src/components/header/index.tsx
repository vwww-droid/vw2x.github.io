"use client";

import * as React from "react";

import { SearchProvider } from "@/components/search/search-provider";
import { NavDesktopMenu } from "./nav-desktop-menu";
import { NavMobileMenu } from "./nav-mobile-menu";

export function Header() {
  const [isHidden, setIsHidden] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(96);
  const headerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    let previousScrollY = window.scrollY;
    let frameId = 0;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY <= 12) {
        setIsHidden(false);
      } else if (delta > 6) {
        setIsHidden(true);
      } else if (delta < -6) {
        setIsHidden(false);
      }

      previousScrollY = currentScrollY;
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  React.useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) {
      return;
    }

    const syncHeight = () => {
      setHeaderHeight(headerElement.getBoundingClientRect().height);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(headerElement);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  return (
    <>
      <div aria-hidden style={{ height: headerHeight }} />
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 border-b border-[#d9d9d9] bg-background/95 backdrop-blur transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-background/80 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1338px] px-4 sm:px-3 md:px-0">
          <SearchProvider>
            <NavDesktopMenu />
            <NavMobileMenu />
          </SearchProvider>
        </div>
      </header>
    </>
  );
}
