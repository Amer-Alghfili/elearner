import { prisma } from "@/prisma";
import { Container } from "./Container";

export async function FlashCards({ learnId }: { learnId: number }) {
  const res = await prisma.flashCard.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      due: "desc",
    },
  });

  return <Container flashCards={res} learnId={learnId} />;
}
