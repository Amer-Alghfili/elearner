import { Stack } from "@chakra-ui/react";
import { FlashCards } from "./flash-cards";
import { PracticeTasks } from "./practice-tasks";

export default async function KnowledgeTestTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const learnId = Number(id);

  return (
    <Stack gap="2em">
      <FlashCards learnId={learnId} />
      <PracticeTasks learnId={learnId} />
    </Stack>
  );
}
