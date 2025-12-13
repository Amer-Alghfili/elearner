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

export async function updateFileBlocks(
  id: number,
  blocks: {
    id: string;
    type: string;
    data: any;
    file_id: number;
    order: number;
  }[]
) {
  if (blocks == null || (blocks as []).length == 0) return;

  await prisma.noteFileBlock.deleteMany({
    where: {
      file_id: id,
    },
  });

  await prisma.noteFileBlock.createMany({
    data: blocks,
  });
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

  await prisma.noteFileBlock.deleteMany({
    where: {
      file_id: id,
    },
  });

  const file = await prisma.noteFile.delete({
    where: {
      id,
    },
  });

  return { data: { ...file, emoji: file.emoji as string }, error: null };
}
