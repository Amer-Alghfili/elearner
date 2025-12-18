import { prisma } from "@/prisma";

export async function FlashCards({ learnId }: { learnId: number }) {
  const res = await prisma.flashCard.findMany({
    where: {
      learn_id: learnId,
    },
  });

  return <div>Flash cards</div>;
}
