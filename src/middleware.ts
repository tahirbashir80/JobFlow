import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Route-level protection remains intentionally lightweight here.
  // Authoritative tenant and permission checks happen server-side.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/setup/:path*", "/customers/:path*", "/jobs/:path*", "/staff/:path*"],
};
