"use server";

import { File } from "@/app/learns/[id]/notes/page";
import { prisma } from "@/prisma";
import z from "zod";

export async function updateFileTitle(id: number, title: string) {
  await prisma.noteFile.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
}

export async function updateFileBlocks(id: number, blocks: any) {
  const data = (blocks as []).map((block: any) => ({
    id: block.id,
    type: block.type,
    data: block,
    file_id: id,
  }));

  for (const block of data) {
    await prisma.noteFileBlock.upsert({
      where: {
        id: block.id,
      },
      create: {
        id: block.id,
        type: block.type,
        data: block.data,
        file_id: id,
      },
      update: {
        type: block.type,
        data: block.data,
      },
    });
  }
}

export type State = { data?: File; error?: string | null };
export async function createFile(_: State, formData: FormData): Promise<State> {
  const learnId = Number(formData.get("learnId"));

  const file = await prisma.noteFile.create({
    data: {
      title: "untitled",
      emoji: "",
      learn_id: learnId,
    },
  });

  return { data: { ...file, emoji: file.emoji as string }, error: null };
}

export async function deleteFile(
  prev: State,
  formData: FormData
): Promise<State> {
  const id = Number(formData.get("id"));

  const file = await prisma.noteFile.delete({
    where: {
      id,
    },
  });

  return { data: { ...file, emoji: file.emoji as string }, error: null };
}
