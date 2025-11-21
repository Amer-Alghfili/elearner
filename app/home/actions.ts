"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import z from "zod";

export async function createLearn(
  _: unknown,
  formData: FormData
): Promise<{ title: string; description: string } | string[]> {
  const data = await auth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const res = z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .safeParse({
      title,
      description,
    });

  if (res.success) {
    const email = data?.user?.email as string;

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        learns: {
          create: {
            title,
            description,
          },
        },
      },
    });

    const learn = await prisma.learns.findFirst({
      where: {
        user_id: email,
      },
    });

    return {
      title: learn?.title as string,
      description: learn?.description as string,
    };
  }

  return res.error.issues.map((issue) => issue.message);
}
