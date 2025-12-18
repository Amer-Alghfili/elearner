import { prisma } from "@/prisma";
import { Container } from "./Container";

export async function PracticeTasks({ learnId }: { learnId: number }) {
  const res = await prisma.practiceTask.findMany({
    where: {
      learn_id: learnId,
    },
  });

  return <Container learnId={learnId} />;
}
