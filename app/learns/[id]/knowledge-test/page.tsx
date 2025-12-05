import { prisma } from "@/prisma";
import React from "react";
import KnowledgeTestList from "./KnowledgeTestList";

export default async function KnowledgeTestTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const knowledgeTests = await prisma.knowledgeTest.findMany({
    where: {
      learn_id: Number(id),
    },
  });

  return (
    <KnowledgeTestList
      knowledgeTests={knowledgeTests.map((test) => ({
        ...test,
        id: test.id.toString(),
        description: test.description as string,
        due: test.due as Date,
        stage: test.stage as string,
        answer: test.answer as string,
        hints: test.hints as string,
        isDraft: false,
      }))}
    />
  );
}
