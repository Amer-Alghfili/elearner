import { Scaffold } from "@/components/Scaffold";
import { prisma } from "@/prisma";
import { ReviewLearnItem, Slider } from "./Slider";
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

  const today = new Date();

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

  const reviewedCount =
    activeFlashcards.filter(
      (f) =>
        f.answeredAt != null &&
        f.answeredAt.getFullYear() === today.getFullYear() &&
        f.answeredAt.getMonth() === today.getMonth() &&
        f.answeredAt.getDate() === today.getDate()
    ).length +
    activePracticeTasks.filter(
      (f) =>
        f.answeredAt != null &&
        f.answeredAt.getFullYear() === today.getFullYear() &&
        f.answeredAt.getMonth() === today.getMonth() &&
        f.answeredAt.getDate() === today.getDate()
    ).length;

  if (!list.length) return;

  return (
    <Scaffold h="100vh">
      <Slider list={list} reviewedCount={reviewedCount} />
    </Scaffold>
  );
}
