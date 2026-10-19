import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-level protection for the admin area. The admin layout and every
// mutation server action also verify the session — this is defense in depth
// so unauthenticated requests never even render admin pages.
export function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (session !== "authenticated") {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
