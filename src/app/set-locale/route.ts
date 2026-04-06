import { NextResponse, type NextRequest } from "next/server";

import { getLanguageSwitchTarget } from "@/lib/content";
import {
  DEFAULT_LOCALE,
  EN_LOCALE,
  LOCALE_COOKIE,
  normalizeLocale,
} from "@/lib/i18n";

export function GET(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("locale");
  const locale =
    normalizeLocale(requestedLocale) === EN_LOCALE ? EN_LOCALE : DEFAULT_LOCALE;
  const current = request.nextUrl.searchParams.get("current");
  const fallbackRedirect = locale === EN_LOCALE ? "/en" : "/";
  const explicitRedirect = request.nextUrl.searchParams.get("redirect");
  const computedRedirect = current
    ? getLanguageSwitchTarget(current).href
    : null;
  const redirect = explicitRedirect || computedRedirect || fallbackRedirect;

  const response = NextResponse.redirect(new URL(redirect, request.url));
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
