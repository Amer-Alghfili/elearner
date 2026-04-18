import { prisma } from "@/prisma";
import { Notebook } from ".";
import { hasReachedLimit } from "@/app/lib/plan-limits";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string; notebookId: string }>;
}) {
  const { notebookId } = await params;

  const [notebook, atCardLimit] = await Promise.all([
    prisma.noteFile.findFirst({
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
    }),
    hasReachedLimit("flashcardsAndTasks"),
  ]);

  //TODO: Not found
  if (notebook == null) return <h1>Not found!</h1>;

  return (
    <Notebook
      atCardLimit={atCardLimit}
      notebook={{
        ...notebook,
        id: notebook.id as number,
        title: notebook.title as string,
        learnId: notebook.learn_id,
      }}
    />
  );
}
