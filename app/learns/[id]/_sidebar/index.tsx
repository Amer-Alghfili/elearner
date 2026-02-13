import { AnswerType } from "../_flashcard-form/types";
import { Sidebar as ClientSidebar } from "./client";
import { prisma } from "@/prisma";
import { Resource as ElearnerResource } from "./resources";
import { Resource } from "@/generated/prisma/client";

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

  const topLevel = resources.filter(
    (resource) => resource.parentResource == null
  );

  const group: ElearnerResource[] = [];

  for (let i = 0; i < topLevel.length; i++) {
    const resource = topLevel[i];

    group.push({
      id: resource.id.toString(),
      title: resource.title,
      icon: resource.icon as string,
      content: nest(resource, [i]),
      indexPath: [],
      parentResourceId: resource.parentResource,
    });
  }

  function nest(
    resource: Resource,
    indexPath: number[]
  ): ElearnerResource[] | string {
    const nestedResources = resources.filter(
      (res) => res.parentResource === resource.id
    );

    if (nestedResources.length === 0) {
      return (resource.link as string) || [];
    }

    return nestedResources.map((res, i) => {
      return {
        id: res.id.toString(),
        title: res.title,
        icon: res.icon as string,
        content: nest(res, [...indexPath, i]),
        indexPath,
        parentResourceId: res.parentResource,
      };
    });
  }

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
      resources={group}
    />
  );
}
