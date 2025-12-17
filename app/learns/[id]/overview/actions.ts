"use server";

import { prisma } from "@/prisma";

export async function updateLearnBlocks(
  id: number,
  blocks: {
    id: string;
    type: string;
    data: any;
    learn_id: number;
    order: number;
  }[]
) {
  if (blocks == null || (blocks as []).length == 0) return;

  await prisma.learnNoteBlock.deleteMany({
    where: {
      learn_id: id,
    },
  });

  await prisma.learnNoteBlock.createMany({
    data: blocks,
  });
}
