"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { authConfig, getUser } from "@/auth.config";

export async function signup(input: FormData) {
  const credentials = {
    email: input.get("email"),
    password: input.get("password"),
  };

  const parsedCredentials = validate(credentials);

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;

    const user = await getUser(email);

    if (user) {
      throw Error("User already exists");
    }

    try {
      await prisma.users.create({
        data: {
          email,
          password,
        },
      });
    } catch (err) {
      throw Error("something went wrong");
    }
  } else {
    throw Error("Invalid credentials.");
  }
}

function validate(
  credentials: unknown
): z.ZodSafeParseResult<{ email: string; password: string }> {
  return z
    .object({ email: z.email(), password: z.string().min(6) })
    .safeParse(credentials);
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = validate(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            return null;
          }
          // const passwordsMatch = await bcrypt.compare(password, user.password);

          // if (password === "1234") return user;
          return user;
        }

        return null;
      },
    }),
  ],
});
