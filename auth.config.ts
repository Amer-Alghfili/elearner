import type { NextAuthConfig } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      const isOnSignupPage = nextUrl.pathname.startsWith("/signup");

      if (isOnLoginPage || isOnSignupPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
      }

      return isLoggedIn;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
