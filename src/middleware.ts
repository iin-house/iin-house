import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit, resetAfter } from "@/lib/rate-limit-inmemory";

const PROTECTED_PREFIXES = ["/creator", "/admin", "/subscriber"];
const AUTH_PAGES = ["/login", "/register"];

// Sensitive API paths get stricter rate limits (50 req/min)
const SENSITIVE_API_PREFIXES = [
  "/api/admin",
  "/api/razorpay",
  "/api/stripe",
  "/api/refunds",
  "/api/media/upload",
  "/api/content",
];

function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/auth" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

function isSensitiveApi(pathname: string): boolean {
  return SENSITIVE_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Rate limiting on API routes ──────────────────────────────────────
  if (pathname.startsWith("/api/") && pathname !== "/api/health") {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const key = `${ip}:${pathname}`;

    if (isAuthPath(pathname)) {
      const allowed = checkRateLimit(key, 100, 60_000);
      if (!allowed) {
        const retryAfter = Math.ceil(resetAfter(key, 60_000) / 1000);
        return new NextResponse(
          JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
            },
          }
        );
      }
    } else if (isSensitiveApi(pathname)) {
      const allowed = checkRateLimit(key, 50, 60_000);
      if (!allowed) {
        const retryAfter = Math.ceil(resetAfter(key, 60_000) / 1000);
        return new NextResponse(
          JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
            },
          }
        );
      }
    } else {
      const allowed = checkRateLimit(key, 100, 60_000);
      if (!allowed) {
        const retryAfter = Math.ceil(resetAfter(key, 60_000) / 1000);
        return new NextResponse(
          JSON.stringify({ error: "Rate limit exceeded", retryAfter }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
            },
          }
        );
      }
    }
  }

  // ── Auth guards (existing logic) ──────────────────────────────────────

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/creator/:path*",
    "/admin/:path*",
    "/subscriber/:path*",
    "/login",
    "/register",
    "/api/:path*",
    "/forgot-password",
    "/reset-password",
  ],
};
