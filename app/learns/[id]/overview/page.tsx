import { prisma } from "@/prisma";
import NoteEditor from ".";

export default async function OverviewTabPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const blocks = await prisma.learnNoteBlock.findMany({
    where: {
      learn_id: Number(id),
    },
  });

  return (
    <NoteEditor
      learnId={Number(id)}
      initialContent={blocks.map((block: any) => block.data) as any[]}
    />
  );
}
