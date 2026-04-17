"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function submitFeedback(
  message: string,
  shareEmail: boolean
): Promise<{ error?: string }> {
  if (!message.trim()) {
    return { error: "Feedback cannot be empty" };
  }

  let user_email: string | null = null;
  if (shareEmail) {
    const session = await auth();
    user_email = session?.user?.email ?? null;
  }

  await prisma.feedback.create({
    data: { message, user_email },
  });

  return {};
}
