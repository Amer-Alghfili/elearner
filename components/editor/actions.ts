"use server";

import { File } from "@/app/learns/[id]/notes/page";
import { prisma } from "@/prisma";
import z from "zod";

export type State = { data: File[]; error: string | null };
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

      if (id == null) {
        await prisma.noteFile.create({
          data: {
            title: "untitled",
            emoji: "",
            learn_id: learnId,
          },
        });
      } else {
        await prisma.noteFile.update({
          where: {
            id,
          },
          data: {
            title,
            emoji,
          },
        });
      }

      return { data: await fetchFiles(learnId), error: null };
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
  const learnId = Number(formData.get("learnId"));

  try {
    await prisma.noteFile.delete({
      where: {
        id,
      },
    });

    return { data: (await fetchFiles(learnId)) as File[], error: null };
  } catch (err) {
    throw err;
  }
}

async function fetchFiles(learnId: number): Promise<File[]> {
  const result = await prisma.noteFile.findMany({
    where: {
      learn_id: learnId,
    },
    include: {
      blocks: true,
    },
  });

  return result.map((file) => ({
    ...file,
    emoji: file.emoji as string,
  }));
}
