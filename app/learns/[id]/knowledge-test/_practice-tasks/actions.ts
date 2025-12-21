"use server";

import { prisma } from "@/prisma";
import z from "zod";

export type PracticeTask = {
  id: number;
  title: string;
  description: string;
  stage: string | null;
  due: Date;
};
export type State = { data?: PracticeTask; error?: string | null };

function calculateDueDate(stage: number): Date {
  const due = new Date();
  switch (stage) {
    case 0:
      due.setDate(due.getDate() + 1);
      return due;
    case 1:
      due.setDate(due.getDate() + 3);
      return due;
    case 2:
      due.setDate(due.getDate() + 7);
      return due;
    case 3:
      due.setDate(due.getDate() + 14);
      return due;
    case 4:
      due.setDate(due.getDate() + 30);
      return due;
    default:
      due.setDate(due.getDate() + 1);
      return due;
  }
}

export async function updateDueDate(id: number, stage: number) {
  const newDue = calculateDueDate(stage);

  await prisma.practiceTask.update({
    where: {
      id,
    },
    data: {
      due: newDue,
      stage: stage.toString(),
    },
  });
}

export async function deletePracticeTask(
  _: unknown,
  formData: FormData
): Promise<State> {
  const id = Number(formData.get("id"));

  try {
    const res = await prisma.practiceTask.delete({
      where: {
        id,
      },
    });
    return { data: res };
  } catch (_) {
    return { error: "Something went wrong" };
  }
}

export async function postPracticeTask(
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
      const due = calculateDueDate(0);

      const created = await prisma.practiceTask.create({
        data: {
          ...data,
          due,
          stage: "0",
          learn_id: learnId,
        },
      });

      return { data: created };
    } else {
      const updated = await prisma.practiceTask.update({
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
