import { prisma } from "@/prisma";
import { Notebook } from ".";

export type File = {
  id: number;
  title: string;
  blocks?: any[];
};
export default async function NotebookTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const files = await prisma.noteFile.findMany({
    where: {
      learn_id: Number(id),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return <Notebook learnId={Number(id)} files={files} />;
}
