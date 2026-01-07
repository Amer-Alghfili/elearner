import React from "react";
import { Notebook } from "./_notebook";
import { prisma } from "@/prisma";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const learnId = Number(id);

  const files = await prisma.noteFile.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return <Notebook files={files} learnId={learnId} mt="5em" />;
}
