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

  const resources = await prisma.resource.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // TODO: group resource by folder and fetch metadata
  const groupResourceByFolder = resources.map((resource) => ({
    ...resource,
    favicon: null,
    content: [],
  }));

  return (
    <ClientSidebar
      learnId={learnId}
      notebooks={notebooks}
      practiceTasks={practiceTasks}
      flashcards={flashcards.map((flashcard) => ({
        ...flashcard,
        answerType: flashcard.answerType as AnswerType,
        options: flashcard.options as string[] | null,
      }))}
      resources={groupResourceByFolder}
    />
  );
}
