"use server";

import { prisma } from "@/prisma";
import { calculateDueDate } from "@/service/knowledge-test";
import { State } from "@/types/server-state";
import z from "zod";
import { PracticeTask } from "./types";

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
): Promise<State<PracticeTask>> {
  const id = Number(formData.get("id"));

  try {
    const res = await prisma.practiceTask.delete({
      where: {
        id,
      },
    });
    return { data: res };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return { error: "Something went wrong" };
  }
}

export async function postPracticeTask(
  _: unknown,
  formData: FormData
): Promise<State<PracticeTask>> {
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
