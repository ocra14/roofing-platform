import { NextResponse, type NextRequest } from "next/server";

/**
 * Redirect middleware — edge-compatible.
 *
 * Previously this file imported `prisma` directly, which is Node-only and
 * caused `prisma:error` on every request when running on the edge runtime.
 * Now it delegates to an internal Node API route (`/api/redirects/lookup`)
 * so the middleware itself stays edge-safe. If the API is unavailable
 * (build time, DB down), it falls through silently.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.svg" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Skip lookup for asset-like paths (has an extension)
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }

  try {
    const lookupUrl = new URL(`/api/redirects/lookup?path=${encodeURIComponent(pathname)}`, request.url);
    const res = await fetch(lookupUrl, {
      headers: { "x-middleware-lookup": "1" },
      // Never cache during dev so admin changes are immediate
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { toUrl?: string; type?: string };
      if (data.toUrl) {
        const status = data.type === "PERMANENT" ? 308 : 307;
        return NextResponse.redirect(new URL(data.toUrl, request.url), status);
      }
    }
  } catch {
    // Lookup failed — fall through to normal handling
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"],
};
