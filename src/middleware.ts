import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PUBLIC_ROUTES,
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_UNAUTH_REDIRECT,
} from "@/lib/constants/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // ── Authenticated user hitting auth pages → send to dashboard ────────────
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  // ── Unauthenticated user hitting protected pages → send to login ──────────
  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL(DEFAULT_UNAUTH_REDIRECT, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
