"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { ZodError } from "@/types/error";
import z from "zod";

export type Learn = { id: number; title: string; description: string | null };

export async function createLearn(
  _: unknown,
  formData: FormData
): Promise<Learn[] | ZodError> {
  const data = await auth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const duplicate = await prisma.learn.count({
    where: {
      user_id: data?.user?.email as string,
      title,
    },
  });

  if (duplicate) {
    return {
      errorMessage: `learn ${title} already exist, please use another name to proceed`,
    };
  }

  const res = z
    .object({
      title: z.string().trim().min(1, "title is required"),
      description: z.string().trim(),
    })
    .safeParse({
      title,
      description,
    });

  if (res.success) {
    const email = data?.user?.email as string;

    await prisma.user.update({
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

    return await prisma.learn.findMany({
      where: {
        user_id: email,
      },
    });
  }

  return {
    errorMessage: res.error.issues
      .map((issue) => issue.message)
      .join(", ") as string,
  };
}
