import { prisma } from "@/prisma";
import { KnowledgeTestLists } from "./KnowledgeTestLists";

export default async function KnowledgeTestTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const learnId = Number(id);

  const [flashcards, practiceTasks] = await Promise.all([
    prisma.flashCard.findMany({
      where: {
        learn_id: learnId,
      },
      orderBy: {
        due: "desc",
      },
    }),
    prisma.practiceTask.findMany({
      where: {
        learn_id: learnId,
      },
      orderBy: {
        due: "desc",
      },
    }),
  ]);

  return (
    <KnowledgeTestLists
      learnId={learnId}
      flashcards={flashcards}
      practiceTasks={practiceTasks}
    />
  );
}
