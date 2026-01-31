"use server";

import { prisma } from "@/prisma";
import { NotebookType } from "../[notebookId]";
import { State } from "@/types/server-state";

export async function createFile(
  notebook: NotebookType
): Promise<State<NotebookType>> {
  const file = await prisma.noteFile.create({
    data: {
      title: notebook.title,
      learn_id: notebook.learnId,
    },
  });

  return { data: { ...file, blocks: [], learnId: file.learn_id }, error: null };
}

export async function deleteFile(
  prev: State<NotebookType>,
  formData: FormData
): Promise<State<NotebookType>> {
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

  return { data: { ...file, blocks: [], learnId: file.learn_id }, error: null };
}
