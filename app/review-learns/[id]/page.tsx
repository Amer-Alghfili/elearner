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

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isAnsweredToday = (answeredAt: Date | null) =>
    answeredAt != null && answeredAt >= startOfToday && answeredAt < tomorrow;

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
          isAnswered: isAnsweredToday(f.answeredAt),
          submittedAnswer: isAnsweredToday(f.answeredAt)
            ? f.submitted_answer
            : null,
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
          isAnswered: isAnsweredToday(f.answeredAt),
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
