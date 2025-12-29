import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Debug: Check if Secret exists
  const secret = process.env.NEXTAUTH_SECRET;
  console.log("Middleware Debug: Secret set?", !!secret, "Length:", secret?.length);

  // Debug: Attempt to get token manually
  try {
    const token = await getToken({ req, secret });
    console.log("Middleware Debug: Manual Token Retrieve:", token ? "Success" : "Failed (Null)");

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
