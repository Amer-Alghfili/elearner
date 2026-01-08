import { prisma } from "@/prisma";
import { Notebook } from ".";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string; notebookId: string }>;
}) {
  const { id, notebookId } = await params;
  const learnId = Number(id);

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
      learnId={learnId}
      mt="5em"
    />
  );
}
