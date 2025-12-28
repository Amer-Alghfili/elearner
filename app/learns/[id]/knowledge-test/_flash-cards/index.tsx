import { prisma } from "@/prisma";
import { Container } from "./Container";
import { AnswerType } from "@/app/learns/[id]/knowledge-test/_flash-cards/types";

export async function FlashCards({ learnId }: { learnId: number }) {
  const res = await prisma.flashCard.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      due: "desc",
    },
  });

  return (
    <Container
      flashCards={res.map((r) => ({
        ...r,
        options: r.options as string[],
        answerType: r.answerType as AnswerType,
      }))}
      learnId={learnId}
    />
  );
}
