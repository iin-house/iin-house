import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/feed",
  "/login",
  "/register",
  "/verify-email",
  "/contact",
  "/terms",
  "/privacy",
  "/demo",
  "/api/auth",
  "/api/health",
  "/api/media",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/media") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg")
  ) {
    return NextResponse.next();
  }

  // Role-based guard using session cookie
  const sessionToken = req.cookies.get("next-auth.session-token")?.value ||
                       req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Decode JWT payload to check role without importing next-auth internals
  try {
    const [, payload] = sessionToken.split(".");
    const decoded = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    const role = decoded?.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
    if (pathname.startsWith("/creator") && role !== "CREATOR") {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
  } catch {
    // If we can't decode the token, let the page handle auth
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|uploads).*)"],
};
