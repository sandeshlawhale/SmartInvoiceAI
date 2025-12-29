import { withAuth } from "next-auth/middleware";

// Force rebuild

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      console.log("Middleware Debug: All Cookies:", req.cookies.getAll().map(c => c.name));
      console.log("Middleware Debug: Token status:", token ? "Found" : "Missing");
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

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
