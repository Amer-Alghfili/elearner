import { authConfig } from "@/auth.config";
import { prisma } from "@/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn: async function ({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email as string;
        try {
          await prisma.users.upsert({
            where: {
              email: email,
            },
            create: {
              email: email,
            },
            update: {
              email: email,
            },
          });

          return true;
        } catch (err) {
          console.log(err);
        }
      }

      return false;
    },
  },
});
