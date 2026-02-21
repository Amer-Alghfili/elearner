import { auth } from "@/auth";
import { prisma } from "@/prisma";
import React from "react";
import { ar } from "zod/v4/locales";

export type ReviewLearnsPageType = {
  id: number;
  title: string;
  total: number;
  reviewedCount: number;
}[];
export default async function ReviewLearnsPage() {
  const userAuth = await auth();
  const email = userAuth?.user?.email;

  const learns = await prisma.learn.findMany({
    select: {
      id: true,
    },
    where: {
      user_id: email as string,
    },
  });

  if (learns.length === 0) return;

  const list: ReviewLearnsPageType = [];

  const today = new Date();

  const learnIds = learns.map(({ id }) => id);
  for (const id of learnIds) {
    const activeFlashcards = await prisma.flashCard.findMany({
      where: {
        learn_id: id,
        OR: [{ due: { lte: today } }, { answeredAt: today }],
      },
      include: {
        learn: { select: { title: true } },
      },
    });

    const activePracticeTasks = await prisma.practiceTask.findMany({
      where: {
        learn_id: id,
        OR: [{ due: { lte: today } }, { answeredAt: today }],
      },
      include: {
        learn: { select: { title: true } },
      },
    });

    if (activeFlashcards.length) {
      const reviewedCount = activeFlashcards.filter(
        (f) =>
          f.answeredAt != null &&
          f.answeredAt.getFullYear() === today.getFullYear() &&
          f.answeredAt.getMonth() === today.getMonth() &&
          f.answeredAt.getDate() === today.getDate()
      ).length;

      list.push({
        id,
        title: activeFlashcards[0].learn.title,
        total: activeFlashcards.length,
        reviewedCount,
      });
    }

    if (activePracticeTasks.length) {
      const reviewedCount = activePracticeTasks.filter(
        (f) =>
          f.answeredAt != null &&
          f.answeredAt.getFullYear() === today.getFullYear() &&
          f.answeredAt.getMonth() === today.getMonth() &&
          f.answeredAt.getDate() === today.getDate()
      ).length;

      list.push({
        id,
        title: activePracticeTasks[0].learn.title,
        total: activePracticeTasks.length,
        reviewedCount,
      });
    }
  }

  console.log(list);

  return <div>page</div>;
}
