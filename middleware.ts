import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Temporarily disabled authentication checks
  // All routes are accessible without authentication
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
