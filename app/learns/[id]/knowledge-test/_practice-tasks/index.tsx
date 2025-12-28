import { prisma } from "@/prisma";
import { PracticeTasksList } from "./List";

export async function PracticeTasks({ learnId }: { learnId: number }) {
  const res = await prisma.practiceTask.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      due: "desc",
    },
  });

  return <PracticeTasksList practiceTasks={res} learnId={learnId} />;
}
