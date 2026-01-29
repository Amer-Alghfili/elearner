import { prisma } from "@/prisma";
import { Notebook } from ".";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string; notebookId: string }>;
}) {
  const { notebookId } = await params;

  const notebook = await prisma.noteFile.findFirst({
    where: {
      id: Number(notebookId),
    },
    include: {
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return (
    <Notebook
      notebook={{
        ...notebook,
        id: notebook?.id as number,
        title: notebook?.title as string,
      }}
    />
  );
}
