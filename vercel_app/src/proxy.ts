import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname.startsWith("/admin") && !token.isAdmin) {
    return NextResponse.redirect(new URL("/apartments", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bookings/:path*", "/admin/:path*"],
};
