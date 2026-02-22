import { Scaffold } from "@/components/Scaffold";
import { prisma } from "@/prisma";
import {
  ReviewLearnItem,
  KnowledgeItemTestFlow,
} from "./KnowledgeItemTestFlow";
import {
  findFlashcardsReadyForReview,
  findPracticeTasksReadyForReview,
} from "../filters";

export default async function ReviewLearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const learnId = Number(id);

  const activeFlashcards = await prisma.flashCard.findMany(
    findFlashcardsReadyForReview(learnId)
  );

  const activePracticeTasks = await prisma.practiceTask.findMany(
    findPracticeTasksReadyForReview(learnId)
  );

  const list: ReviewLearnItem[] = [
    ...activeFlashcards.map(
      (f) =>
        ({
          id: f.id,
          title: f.question,
          hint: f.hint,
          answer: f.answer,
          type: "flashcard",
          stage: Number(f.stage),
          isAnswered: f.answeredAt != null,
          submittedAnswer: f.submitted_answer,
          answerType: f.answerType,
          options: f.options,
        } as ReviewLearnItem)
    ),
    ...activePracticeTasks.map(
      (f) =>
        ({
          id: f.id,
          title: f.title,
          hint: null,
          answer: f.description,
          type: "practiceTask",
          stage: Number(f.stage),
          isAnswered: f.answeredAt != null,
        } as ReviewLearnItem)
    ),
  ];

  if (!list.length) return;

  return (
    <Scaffold h="100vh">
      <KnowledgeItemTestFlow list={list} />
    </Scaffold>
  );
}
