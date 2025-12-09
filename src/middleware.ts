import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session");
    const isLoginPage = request.nextUrl.pathname === "/login";

    // If user is on login page and has session, redirect to dashboard
    if (isLoginPage && session) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is accessing protected route (not login, not public assets)
    if (!session && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (Auth API)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
