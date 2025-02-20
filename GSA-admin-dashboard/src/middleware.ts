// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // 1) Check if the request path starts with "/dashboard"
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // 2) Read the "token" cookie
    const token = req.cookies.get("token")?.value;

    // 3) If no token, redirect to "/signin"
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If everything is fine, allow the request to proceed
  return NextResponse.next();
}
