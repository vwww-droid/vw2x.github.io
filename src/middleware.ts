import { NextResponse, type NextRequest } from "next/server";

import {
  EN_LOCALE,
  LOCALE_COOKIE,
  normalizeLocale,
} from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/apple-icon.png"
  ) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (pathname === "/") {
    const preferredLocale = cookieLocale
      ? normalizeLocale(cookieLocale)
      : normalizeLocale(request.headers.get("accept-language"));

    if (preferredLocale === EN_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
