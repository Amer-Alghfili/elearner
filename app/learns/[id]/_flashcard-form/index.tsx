import { useLearnControlManagement } from "../LearnPageContainer";
import { Stack } from "@chakra-ui/react";
import Upsert from "./upsert";

export function FlashcardForm({ learnId }: { learnId: number }) {
  const { flashcardForm } = useLearnControlManagement();

  return (
    <Stack
      bg="neutral.background"
      position="fixed"
      right={0}
      top={0}
      bottom={0}
      overflow="auto"
      w={flashcardForm.open ? "40vw" : 0}
      borderInlineStartWidth="1px"
      borderInlineStartColor="stroke"
      transition="width 0.3s ease-in-out"
    >
      <Upsert learnId={learnId} />
    </Stack>
  );
}
