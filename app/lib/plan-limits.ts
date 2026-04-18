"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

type LimitType = "learns" | "notebooks" | "flashcardsAndTasks";

const PLAN_LIMITS: Record<LimitType, number> = {
  learns: 3,
  notebooks: 15,
  flashcardsAndTasks: 30,
};

async function isPremium(email: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { user_email: email },
    select: { endsAt: true },
  });
  return subscription !== null && subscription.endsAt > new Date();
}

async function getCount(email: string, type: LimitType): Promise<number> {
  if (type === "learns") {
    return prisma.learn.count({ where: { user_id: email } });
  }
  if (type === "notebooks") {
    return prisma.noteFile.count({ where: { learn: { user_id: email } } });
  }
  const [flashCards, practiceTasks] = await Promise.all([
    prisma.flashCard.count({ where: { learn: { user_id: email } } }),
    prisma.practiceTask.count({ where: { learn: { user_id: email } } }),
  ]);
  return flashCards + practiceTasks;
}

export async function hasReachedLimit(type: LimitType): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) throw Error("User is not found");

  const email = session.user.email;

  if ((await isPremium(email)) || email === "ameralghfili@gmail.com")
    return false;

  const current = await getCount(email, type);
  return current >= PLAN_LIMITS[type];
}
