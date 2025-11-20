import type { NextAuthConfig } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn) {
        if (isOnLoginPage) {
          return Response.redirect(new URL("/", nextUrl));
        }

        return true;
      }

      if (isOnLoginPage) {
        return false;
      }

      return Response.redirect(new URL("/login", nextUrl));
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
