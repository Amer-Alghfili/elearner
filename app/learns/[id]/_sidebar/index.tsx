import { Sidebar as ClientSidebar } from "./client";
import { prisma } from "@/prisma";

export async function Sidebar({ learnId }: { learnId: number }) {
  const notebooks = await prisma.noteFile.findMany({
    select: {
      id: true,
      title: true,
    },
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <ClientSidebar notebooks={notebooks} />;
}
