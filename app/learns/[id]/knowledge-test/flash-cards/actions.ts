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
  hint: string | null;
  learn_id: number;
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
    return {
      data: {
        ...res,
        answerType: res.answerType as AnswerType,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return { error: "Something went wrong" };
  }
}

export async function postFlashCard(flashCard: FlashCard): Promise<State> {
  const validate = z
    .object({
      id: z.number("Invalid ID").optional(),
      learn_id: z.number("Invalid LID"),
      question: z.string("Invalid question"),
      answer: z.string("Invalid answer"),
      answerType: z.enum(["multiple-choices", "true-false", "open-ended"]),
      hint: z
        .string("Invalid hint")
        .optional()
        .transform((val) => (val === "" ? null : val)),
    })
    .safeParse(flashCard);

  if (validate.success) {
    const { data } = validate;
    const { id } = data;

    if (id == null) {
      const due = new Date();
      due.setDate(due.getDate() + 3);

      const created = await prisma.flashCard.create({
        data: {
          ...data,
          due,
          stage: "0",
        },
      });

      return {
        data: {
          ...created,
          answerType: created.answerType as AnswerType,
        },
      };
    } else {
      const updated = await prisma.flashCard.update({
        where: {
          id: Number(id),
        },
        data,
      });

      return {
        data: {
          ...updated,
          answerType: updated.answerType as AnswerType,
        },
      };
    }
  } else {
    return { error: validate.error.issues.map((i) => i.message).join("\n") };
  }
}
