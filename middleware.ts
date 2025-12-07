import { withAuth } from "next-auth/middleware";

// Force rebuild

export default withAuth({
  pages: {
    signIn: "/login",
  },
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
