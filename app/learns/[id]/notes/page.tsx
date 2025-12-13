import { prisma } from "@/prisma";
import { NoteEditorContainer } from "./NoteEditorContainer";

export type File = {
  id: number;
  title: string;
  blocks?: any[];
};
export default async function NotesTabPage({
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
      // TODO: allow for re-order files
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

  return <NoteEditorContainer learnId={Number(id)} files={files} />;
}
