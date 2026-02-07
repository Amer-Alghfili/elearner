import { AnswerType } from "../_flashcard-form/types";
import { Sidebar as ClientSidebar } from "./client";
import { prisma } from "@/prisma";
import { Resource as ElearnerResource } from "./resources";
import { Resource } from "@/generated/prisma/client";
import { title } from "process";

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

  // const resources = await prisma.resource.findMany({
  //   where: {
  //     learn_id: learnId,
  //   },
  //   orderBy: {
  //     createdAt: "asc",
  //   },
  // });
  const resources: Pick<Resource, "id" | "parentResource">[] = [
    {
      id: 1,
      parentResource: null,
    },
    {
      id: 2,
      parentResource: 3,
    },
    {
      id: 3,
      parentResource: 1,
    },
    {
      id: 4,
      parentResource: 1,
    },
    {
      id: 5,
      parentResource: null,
    },
  ];

  const topLevel = resources.filter(
    (resource) => resource.parentResource == null
  );

  const group: ElearnerResource[] = [];

  for (const resource of topLevel) {
    group.push({
      id: resource.id.toString(),
      title: resource.id.toString(),
      icon: null,
      content: nest(resource),
    });
  }

  function nest(
    resource: Pick<Resource, "id" | "parentResource">
  ): ElearnerResource[] | string {
    const filter = resources.filter(
      (res) => res.parentResource === resource.id
    );

    if (filter.length === 0) return `Link of ${resource.id}`;

    return filter.map((res) => {
      return {
        id: res.id.toString(),
        title: res.id.toString(),
        icon: null,
        content: nest(res),
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
      resources={[]}
    />
  );
}
