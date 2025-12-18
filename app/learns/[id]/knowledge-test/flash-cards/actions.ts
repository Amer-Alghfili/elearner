"use server";

import { prisma } from "@/prisma";
import z from "zod";

export type AnswerType = "multiple-choices" | "true-false" | "open-ended";
export type FlashCard = {
  id: number;
  question: string;
  answerType: AnswerType;
  answer: string;
  stage: string;
  due: Date;
};
export type State = { data?: FlashCard; error?: string | null };

export async function deleteFlashCard(
  _: unknown,
  formData: FormData
): Promise<State> {
  const id = Number(formData.get("id"));

  try {
    const res = await prisma.flashCard.delete({
      where: {
        id,
      },
    });
    return { data: res };
  } catch (_) {
    return { error: "Something went wrong" };
  }
}

export async function postFlashCard(
  _: unknown,
  formData: FormData
): Promise<State> {
  const validate = z
    .object({
      title: z.string("Invalid title"),
      description: z.string("Invalid description"),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (validate.success) {
    const { data } = validate;

    const learnId = Number(formData.get("learnId"));
    const id = formData.get("id");

    if (id == null) {
      const due = new Date();
      due.setDate(due.getDate() + 3);

      const created = await prisma.flashCard.create({
        data: {
          ...data,
          due,
          stage: "0",
          learn_id: learnId,
        },
      });

      return { data: created };
    } else {
      const updated = await prisma.flashCard.update({
        where: {
          id: Number(id),
        },
        data,
      });

      return { data: updated };
    }
  } else {
    return { error: validate.error.issues.map((i) => i.message).join("\n") };
  }
}
