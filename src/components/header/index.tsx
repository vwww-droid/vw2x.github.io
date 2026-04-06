import { SearchProvider } from "@/components/search/search-provider";
import { NavDesktopMenu } from "./nav-desktop-menu";
import { NavMobileMenu } from "./nav-mobile-menu";

export function Header() {
  return (
    <>
      <div aria-hidden className="h-14 md:hidden" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <SearchProvider>
            <NavDesktopMenu />
            <NavMobileMenu />
          </SearchProvider>
        </div>
      </header>
    </>
  );
}
