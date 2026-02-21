"use server";

import { prisma } from "@/prisma";
import { calculateDueDate } from "@/service/knowledge-test";
import { State } from "@/types/server-state";
import z from "zod";

export async function updateDueDate(
  _: unknown,
  formData: FormData
): Promise<State<{ id: string }>> {
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
    const { id, type } = res.data;

    const newDue = calculateDueDate(stage);

    let result: string;
    if (type === "flashcard") {
      const res = await prisma.flashCard.update({
        where: {
          id: Number(id),
        },
        data: {
          due: newDue,
          stage: stage.toString(),
          answeredAt: new Date(),
        },
      });

      result = res.id.toString();
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

      result = res.id.toString();
    }

    return {
      data: { id: result },
    };
  }

  return {
    error: res.error.issues.map((i) => i.message).join("\n"),
  };
}
