"use server";

import { prisma } from "@/prisma";
import { calculateDueDate } from "@/service/knowledge-test";
import { State } from "@/types/server-state";
import z from "zod";

export async function submitAnswer(
  _: unknown,
  formData: FormData
): Promise<State<{ id: string; answer: string | null }>> {
  const id = formData.get("id") as string;
  const stage = Number(formData.get("stage") as string);
  const type = formData.get("type") as string;
  const answer = formData.get("answer") as string;

  const res = z
    .object({
      id: z.string("Invalid id"),
      stage: z.number("Invalid stage").min(1).max(4),
      type: z.enum(["flashcard", "practiceTask"], "Invalid type"),
      answer: z.string("Invalid answer").trim().nullish(),
    })
    .safeParse({
      id,
      stage,
      type,
      answer,
    });

  if (res.success) {
    const { id, type, answer } = res.data;

    const newDue = calculateDueDate(stage);

    let result: { id: string; answer: string | null };
    if (type === "flashcard") {
      if (!answer) return { data: { id: id, answer: null } };

      const res = await prisma.flashCard.update({
        where: {
          id: Number(id),
        },
        data: {
          due: newDue,
          stage: stage.toString(),
          answeredAt: new Date(),
          submitted_answer: answer,
        },
      });

      result = { id: res.id.toString(), answer: res.submitted_answer };
    } else {
      const res = await prisma.practiceTask.update({
        where: {
          id: Number(id),
        },
        data: {
          due: newDue,
          stage: stage.toString(),
          answeredAt: new Date(),
        },
      });

      result = { id: res.id.toString(), answer: null };
    }

    return {
      data: result,
    };
  }

  return {
    error: res.error.issues.map((i) => i.message).join("\n"),
  };
}
