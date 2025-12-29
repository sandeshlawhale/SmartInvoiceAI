import { withAuth } from "next-auth/middleware";

// Force rebuild

export default withAuth({
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
