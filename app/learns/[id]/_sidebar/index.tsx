import { AnswerType } from "../_flashcard-form/types";
import { Sidebar as ClientSidebar } from "./client";
import { prisma } from "@/prisma";

export async function Sidebar({ learnId }: { learnId: number }) {
  const notebooks = await prisma.noteFile.findMany({
    select: {
      id: true,
      title: true,
    },
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const flashcards = await prisma.flashCard.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const practiceTasks = await prisma.practiceTask.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ClientSidebar
      notebooks={notebooks}
      flashcards={flashcards.map((flashcard) => ({
        ...flashcard,
        answerType: flashcard.answerType as AnswerType,
        options: flashcard.options as string[] | null,
      }))}
      practiceTasks={practiceTasks}
    />
  );
}
