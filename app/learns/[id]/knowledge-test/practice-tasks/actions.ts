"use server";

import { prisma } from "@/prisma";
import z from "zod";

export type PracticeTask = {
  id: number;
  title: string;
  description: string;
  stage: string;
  due: Date;
};
export type State = { data?: PracticeTask; error?: string | null };

//TODO: update practice task
export async function postPracticeTask(
  _: unknown,
  formData: FormData
): Promise<State> {
  console.log(formData.get("title"));
  console.log(formData.get("description"));

  const validate = z
    .object({
      title: z.string("Invalid title"),
      description: z.string("Invalid description"),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (validate.success) {
    const { data } = validate;

    const learnId = Number(formData.get("learnId"));

    const created = await prisma.practiceTask.create({
      data: {
        ...data,
        due: new Date(),
        stage: "0",
        learn_id: learnId,
      },
    });

    return { data: created };
  } else {
    return { error: validate.error.issues.map((i) => i.message).join("\n") };
  }
}
