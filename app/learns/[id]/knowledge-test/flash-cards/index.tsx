import { prisma } from "@/prisma";
import { Container } from "./Container";
import { AnswerType } from "./actions";

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
        answerType: r.answerType as AnswerType,
      }))}
      learnId={learnId}
    />
  );
}
