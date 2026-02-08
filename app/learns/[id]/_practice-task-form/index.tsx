import { useLearnControlManagement } from "../LearnPageContainer";
import { Stack } from "@chakra-ui/react";
import Upsert from "./upsert";
import React from "react";

export function PracticeTaskForm({ learnId }: { learnId: number }) {
  const { practiceTaskForm } = useLearnControlManagement();

  const [width, setWidth] = React.useState("0");

  React.useEffect(() => {
    if (practiceTaskForm.open) {
      const timer = setTimeout(() => setWidth("40vw"), 0);
      return () => clearTimeout(timer);
    }
  }, [practiceTaskForm.open]);

  return (
    <Stack
      bg="neutral.background"
      position="fixed"
      right={0}
      top={0}
      bottom={0}
      overflow="auto"
      w={width}
      borderInlineStartWidth="1px"
      borderInlineStartColor="stroke"
      transition="width 0.3s ease-in-out"
    >
      <Upsert
        key={practiceTaskForm.practiceTask?.id.toString()}
        learnId={learnId}
      />
    </Stack>
  );
}
