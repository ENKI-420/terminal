import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Handle requests to vusercontent.net
  if (request.nextUrl.pathname.includes("vusercontent") || request.headers.get("referer")?.includes("vusercontent")) {
    // Add proper headers for content loading
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Add caching headers
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
