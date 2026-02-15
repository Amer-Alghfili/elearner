import { prisma } from "@/prisma";
import NoteEditor from ".";
import { Stack } from "@chakra-ui/react";
import { ReadyToReviewKnowledgeTest } from "./ready-for-review-knowledge-test";
import { AnswerType } from "../_flashcard-form/types";

export default async function OverviewTabPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const learn_id = Number(id);

  const today = new Date();

  const [blocks, practiceTasks, flashcards] = await Promise.all([
    await prisma.learnNoteBlock.findMany({
      where: {
        learn_id,
      },
    }),
    await prisma.practiceTask.findMany({
      where: {
        learn_id,
        due: {
          lte: today,
        },
      },
    }),
    await prisma.flashCard.findMany({
      where: {
        learn_id,
        due: {
          lte: today,
        },
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
