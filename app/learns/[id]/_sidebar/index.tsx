import { prisma } from "@/prisma";
import { SidebarContent } from "./SidebarContent";

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

  return <SidebarContent notebooks={notebooks} />;
}
