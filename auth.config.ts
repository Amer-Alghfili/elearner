import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";
// import GoogleProvider from "next-auth/providers/google";

export async function getUser(
  email: string
): Promise<{ email: string; password: string | null } | null> {
  try {
    return await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
  } catch (err) {
    throw Error("Something went wrong");
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },

  callbacks: {
    session: async function ({ session, user }) {
      const res = await getUser(user?.email as string);
      if (res) return session;

      return {
        user: {
          email: null,
        },
        expires: "1900-01-01",
      };
    },

    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname.startsWith("/signup")) return true;

      const isLoggedIn = !!auth?.user?.email;

      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (isLoggedIn) {
        if (isOnLoginPage) {
          return Response.redirect(new URL("/home", nextUrl));
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
