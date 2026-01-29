import { prisma } from "@/prisma";
import { SidebarContent } from "./SidebarContent";
import React from "react";

export async function Sidebar({
  learnId,
  children,
}: {
  learnId: number;
  children: React.ReactElement;
}) {
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

  return <SidebarContent notebooks={notebooks}>{children}</SidebarContent>;
}
