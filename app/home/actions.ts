"use server";

import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/prisma";
import { ZodError } from "@/types/error";
import z from "zod";
import { da } from "zod/v4/locales";

export type Learn = { id: number; title: string; description: string | null };

export async function deleteLearn(id: number) {
  try {
    const data = await auth();

    await prisma.learn.delete({
      where: {
        id,
      },
    });

    return await prisma.learn.findMany({
      where: {
        user_id: data?.user?.email as string,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function postLearn(
  _: unknown,
  formData: FormData
): Promise<Learn[] | ZodError | undefined> {
  const data = await auth();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

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

    try {
      if (id) {
        await prisma.learn.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            description,
          },
        });
      } else {
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
      }

      return await prisma.learn.findMany({
        where: {
          user_id: email,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return {
            errorMessage:
              "Learn title is already used, please use another name",
          };
        }
      }
    }
  } else {
    return {
      errorMessage: res.error.issues
        .map((issue) => issue.message)
        .join(", ") as string,
    };
  }
}
