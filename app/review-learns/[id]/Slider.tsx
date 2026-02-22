"use client";

import React from "react";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import {
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { updateDueDate } from "./action";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { ShowAnswer } from "./ShowAnswer";

export type ReviewLearnItem = {
  id: number;
  title: string;
  hint: string | null;
  answer: string;
  type: "flashcard" | "practiceTask";
  stage: number;
};
export function Slider({
  list,
  reviewedCount,
}: {
  list: ReviewLearnItem[];
  reviewedCount: number;
}) {
  const router = useRouter();

  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(0);
  const [state, action, loading] = React.useActionState(
    updateDueDate,
    undefined
  );

  const [openAnswer, setOpenAnswer] = React.useState(false);

  const progress = (reviewedCount / list.length) * 100;
  const activeItem = list[activeItemIndex];

  const postSubmission = React.useEffectEvent((inState: typeof state) => {
    setOpenAnswer(false);

    if (inState?.data?.id === list[activeItemIndex].id.toString()) {
      if (activeItemIndex === list.length - 1) {
        toaster.create({
          title: "You have reviewed all of the learn items 🎉",
          type: "success",
          closable: true,
        });
        router.replace("/home");
      } else {
        setActiveItemIndex((prev) => prev + 1);
      }
    } else if (inState?.error) {
      toaster.create({
        title: inState.error,
        type: "error",
        closable: true,
      });
    }
  });
  React.useEffect(() => {
    postSubmission(state);
  }, [state]);

  return (
    <>
      <form
        action={action}
        style={{
          height: "100%",
          maxWidth: "40em",
          margin: openAnswer ? 0 : "0 25% 0",
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Input id="type" name="type" hidden={true} value={activeItem.type} />
        <Input id="id" name="id" hidden={true} value={activeItem.id} />
        <Input
          id="stage"
          name="stage"
          hidden={true}
          value={
            activeItem.stage === 4 ? activeItem.stage : activeItem.stage + 1
          }
        />
        <Stack justifyContent="space-between" h="full" py="4em">
          <ProgressRoot value={progress} w="100%">
            <Stack gap="0.5em">
              <ProgressBar />
              <ProgressValueText>{`${reviewedCount} of ${list.length}`}</ProgressValueText>
            </Stack>
          </ProgressRoot>
          <Stack gap="3em">
            <Heading as="h2" textAlign="center">
              {activeItem.title}
            </Heading>
            <Stack gap="1em">
              <Flex w="full" gap="1em">
                {activeItem.hint && (
                  <Button variant="secondary" flex="100%">
                    💡 Hint
                  </Button>
                )}
                <Button
                  onClick={() => setOpenAnswer(true)}
                  variant="secondary"
                  flex="100%"
                >
                  Show Answer
                </Button>
              </Flex>
              {activeItem.type === "flashcard" && (
                <Textarea id="answer" name="answer" h="8em" />
              )}
            </Stack>
          </Stack>
          <Flex gap="3em" justifyContent="space-between">
            {activeItemIndex !== 0 && (
              <Button
                onClick={() => setActiveItemIndex((prev) => prev - 1)}
                variant="secondary"
                w="30%"
              >
                Previous
              </Button>
            )}
            <Button type="submit" loading={loading} w="30%" ms="auto">
              {activeItemIndex === list.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        </Stack>
      </form>
      <ShowAnswer
        answer={activeItem.answer}
        open={openAnswer}
        onClose={() => setOpenAnswer(false)}
      />
    </>
  );
}
