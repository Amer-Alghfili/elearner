"use server";

import { prisma } from "@/prisma";

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
