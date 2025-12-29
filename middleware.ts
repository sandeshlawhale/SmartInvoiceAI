import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Debug: Check if Secret exists
  const secret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  console.log("Middleware Debug (Edge): Secret prefix:", secret ? secret.substring(0, 5) : "None", "Length:", secret?.length);
  console.log("Middleware Debug (Edge): NEXTAUTH_URL:", nextAuthUrl || "Undefined");
  console.log("Middleware Debug (Edge): All Cookies:", req.cookies.getAll().map(c => c.name));

  // Debug: Attempt to get token manually
  try {
    // 1. Try forcing secure cookie (Common fix for Vercel)
    console.log("Middleware Debug: Attempting Secure Token Retrieval...");
    let token = await getToken({ req, secret, secureCookie: true });

    if (token) {
      console.log("Middleware Debug: Secure Retrieval SUCCESS!");
    } else {
      console.log("Middleware Debug: Secure Retrieval Failed, trying auto-detect...");
      // 2. Fallback to default
      token = await getToken({ req, secret });
    }

    console.log("Middleware Debug: Final Token Status:", token ? "Success" : "Failed (Null)");

    // If we are on a protected path and no token, redirect
    if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
      console.log("Middleware Debug: Redirecting to login");
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Middleware Debug: Error retrieving token:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoice/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
