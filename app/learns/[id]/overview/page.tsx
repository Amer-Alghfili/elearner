import { prisma } from "@/prisma";
import NoteEditor from ".";
import { Stack } from "@chakra-ui/react";
import { ReadyToReviewKnowledgeTest } from "./ready-for-review-knowledge-test";
import { AnswerType } from "../knowledge-test/_flash-cards/actions";

export default async function OverviewTabPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const learn_id = Number(id);

  //TODO: filter by due date and completion stage
  const [blocks, practiceTasks, flashcards] = await Promise.all([
    await prisma.learnNoteBlock.findMany({
      where: {
        learn_id,
      },
    }),
    await prisma.practiceTask.findMany({
      where: {
        learn_id,
      },
    }),
    await prisma.flashCard.findMany({
      where: {
        learn_id,
      },
    }),
  ]);

  const editor = (
    <NoteEditor
      learnId={Number(id)}
      initialContent={blocks.map((block: any) => block.data) as any[]}
    />
  );

  if (practiceTasks.length == 0 && flashcards.length == 0) return editor;

  return (
    <Stack gap="3em">
      <ReadyToReviewKnowledgeTest
        practiceTasks={practiceTasks}
        flashcards={flashcards.map((f) => ({
          ...f,
          answerType: f.answerType as AnswerType,
          options: f.options as string[] | null,
        }))}
      />
      {editor}
    </Stack>
  );
}
