import { Editor } from "@/components/editor";
import { prisma } from "@/prisma";

export type File = {
  id: number;
  title: string;
  emoji?: string;
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
    include: {
      blocks: true,
    },
  });

  return (
    <Editor
      learnId={Number(id)}
      files={files.map((file) => ({ ...file, emoji: file.emoji as string }))}
    />
  );
}
