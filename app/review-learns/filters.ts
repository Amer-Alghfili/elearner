import { Prisma } from "@/generated/prisma/client";
import {
  FlashCardFindManyArgs,
  PracticeTaskFindManyArgs,
} from "@/generated/prisma/models";

export function findFlashcardsReadyForReview(
  learnId: number
): Prisma.SelectSubset<FlashCardFindManyArgs, FlashCardFindManyArgs<never>> {
  const today = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);

  return {
    where: {
      learn_id: learnId,
      OR: [
        { due: { lte: today } },
        {
          answeredAt: {
            lt: tomorrow,
            gt: startOfToday,
          },
        },
      ],
    },
  };
}

export function findPracticeTasksReadyForReview(
  learnId: number
): Prisma.SelectSubset<
  PracticeTaskFindManyArgs,
  PracticeTaskFindManyArgs<never>
> {
  const today = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);

  return {
    where: {
      learn_id: learnId,
      OR: [
        { due: { lte: today } },
        {
          answeredAt: {
            lt: tomorrow,
            gt: startOfToday,
          },
        },
      ],
    },
  };
}
