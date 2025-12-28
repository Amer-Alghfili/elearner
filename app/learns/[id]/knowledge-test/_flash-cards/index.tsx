import { prisma } from "@/prisma";
import { FlashcardsList } from "./List";
import { AnswerType } from "./types";

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
    <FlashcardsList
      flashCards={res.map((r) => ({
        ...r,
        options: r.options as string[],
        answerType: r.answerType as AnswerType,
      }))}
      learnId={learnId}
    />
  );
}
