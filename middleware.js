import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for the dashboard (excluding login and callback)
  if (path.startsWith("/dashboard") && !path.startsWith("/dashboard/login") && !path.includes("/api/auth/callback")) {
    // Check if the user is authenticated by looking for the auth cookie
    const authCookie = request.cookies.get("discord_auth")

    // If there's no auth cookie, redirect to the login page
    if (!authCookie) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
}

