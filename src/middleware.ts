import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.next();
  }

  const user = token as any;
  const pathname = request.nextUrl.pathname;

  // CONTACTED users should only access /task-submission
  if (user.status === "CONTACTED") {
    // If they're trying to access any page except task-submission, redirect them
    if (pathname !== "/task-submission" && pathname.startsWith("/")) {
      // Don't redirect if already on login or auth pages
      if (!pathname.startsWith("/login") &&
          !pathname.startsWith("/signup") &&
          !pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/task-submission", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
