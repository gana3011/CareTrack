
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { requireAuth } from "./lib/requireAuth";
import { jwtDecode } from "jwt-decode";

export async function middleware(request) {
  const authRes = await auth0.middleware(request);
  const pathname = request.nextUrl.pathname;

  // Allow auth routes to pass through
  if (pathname.startsWith("/auth")) {
    return authRes;
  }

  // Allow API routes to pass through without authentication
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle home page differently - redirect authenticated users to their dashboard
  if (pathname === "/") {
    try {
      const session = await auth0.getSession();
      if (session) {
        const token = session.tokenSet.accessToken;
        const decoded = jwtDecode(token);
        const roles = decoded["https://healthcare.com/roles"] || [];
        if (roles.includes("manager")) {
          return NextResponse.redirect(`${request.nextUrl.origin}/manager/dashboard`);
        } else if (roles.includes("worker")) {
          return NextResponse.redirect(`${request.nextUrl.origin}/worker/dashboard`);
        }
      }
    } catch (error) {
      console.error("Error checking session on home page:", error);
    }
    console.log("Allowing unauthenticated access to home page");
    return authRes;
  }

  try {
    const session = await auth0.getSession(request);
  
    if (!session) {
      return NextResponse.redirect(`${request.nextUrl.origin}/auth/login`);
    }
    const token = session.tokenSet.accessToken;
    const decoded = jwtDecode(token);
    const roles = decoded["https://healthcare.com/roles"] || [];

    // Check if user is already on their correct dashboard
    if (roles.includes("manager") && pathname.startsWith("/manager")) {
      return NextResponse.next();
    }
    if (roles.includes("worker") && pathname.startsWith("/worker")) {
      return NextResponse.next();
    }

    // // Redirect to appropriate dashboard based on role (only for non-dashboard paths)
    // if (roles.includes("manager") && !pathname.startsWith("/manager")) {
    //   return NextResponse.redirect(`${request.nextUrl.origin}/manager/dashboard`);
    // } else if (roles.includes("worker") && !pathname.startsWith("/worker")) {
    //   return NextResponse.redirect(`${request.nextUrl.origin}/worker/dashboard`);
    // }

    // If no valid role, redirect to login
    if (!roles.includes("manager") && !roles.includes("worker")) {
      return NextResponse.redirect(`${request.nextUrl.origin}/auth/login`);
    }
    return authRes;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login`);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
