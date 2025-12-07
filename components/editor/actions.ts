"use server";

import { File } from "@/app/learns/[id]/notes/page";
import { prisma } from "@/prisma";
import z from "zod";

export type State = { data?: File; error?: string | null };
export async function postFile(
  prev: State,
  formData: FormData
): Promise<State> {
  try {
    const id =
      formData.get("id") == null ? null : Number(formData.get("id") as string);

    const file: Omit<File, "id"> = {
      title: formData.get("title") as string,
      emoji: formData.get("emoji") as string,
    };

    let parsedFile;

    if (id == null) {
      parsedFile = z.safeParse(z.object({}), file);
    } else {
      parsedFile = z
        .object({
          title: z.string().min(1, "title is required"),
          //TODO: validate emoji
        })
        .safeParse(file);
    }

    if (parsedFile.success) {
      const title = formData.get("title") as string;
      const emoji = formData.get("emoji") as string;
      const learnId = Number(formData.get("learnId"));

      let file;
      if (id == null) {
        file = await prisma.noteFile.create({
          data: {
            title: "untitled",
            emoji: "",
            learn_id: learnId,
          },
        });
      } else {
        file = await prisma.noteFile.update({
          where: {
            id,
          },
          data: {
            title,
            emoji,
          },
        });
      }

      return { data: { ...file, emoji: file.emoji as string }, error: null };
    }

    return {
      data: prev.data,
      error: parsedFile.error?.issues
        .map((issue) => issue.message)
        .join(", ") as string,
    };
  } catch (err) {
    throw err;
  }
}

export async function deleteFile(
  prev: State,
  formData: FormData
): Promise<State> {
  const id = Number(formData.get("id"));

  try {
    const file = await prisma.noteFile.delete({
      where: {
        id,
      },
    });

    return { data: { ...file, emoji: file.emoji as string }, error: null };
  } catch (err) {
    throw err;
  }
}
