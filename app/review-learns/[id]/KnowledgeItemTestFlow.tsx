"use client";

import React from "react";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import {
  Badge,
  Button,
  createListCollection,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { submitAnswer } from "./action";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { ShowAnswer } from "./ShowAnswer";
import { Tooltip } from "@/components/ui/tooltip";
import { TickIcon } from "@/components/Icons";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

type AnswerType = "multiple-choices" | "true-false" | "open-ended";

export type ReviewLearnItem = {
  id: number;
  title: string;
  hint: string | null;
  answer: string;
  type: "flashcard" | "practiceTask";
  stage: number;
  isAnswered: boolean;
  submittedAnswer: string | null;
  answerType: AnswerType;
  options?: string[];
};
export function KnowledgeItemTestFlow({ list }: { list: ReviewLearnItem[] }) {
  const [questions, setQuestions] = React.useState(
    list.toSorted((a, b) => {
      if (a.isAnswered && b.isAnswered) return 0;
      if (a.isAnswered) return -1;

      return 1;
    })
  );

  const router = useRouter();

  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(
    function startFromFirstUnansweredQuestion() {
      const index = questions.findIndex((q) => !q.isAnswered);
      return index < 0 ? 0 : index;
    }
  );
  const [state, action, loading] = React.useActionState(
    submitAnswer,
    undefined
  );

  const [openAnswer, setOpenAnswer] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  const progress =
    activeItemIndex === 0 ? 0 : (activeItemIndex / list.length) * 100;
  const activeItem = questions[activeItemIndex];

  const postSubmission = React.useEffectEvent((inState: typeof state) => {
    setOpenAnswer(false);

    if (inState?.data?.id === questions[activeItemIndex].id.toString()) {
      if (activeItemIndex === questions.length - 1) {
        toaster.create({
          title: "You have reviewed all of the learn items 🎉",
          type: "success",
          closable: true,
        });
        router.replace("/home");
      } else {
        if (inState.data.answer) {
          const updated = [...questions];
          updated[activeItemIndex] = {
            ...updated[activeItemIndex],
            isAnswered: true,
            submittedAnswer: inState.data.answer,
          };

          setQuestions(updated);
        }
        setActiveItemIndex((prev) => prev + 1);
      }
      router.refresh();
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
              <ProgressValueText>{`${activeItemIndex} of ${questions.length}`}</ProgressValueText>
            </Stack>
          </ProgressRoot>
          <Stack gap="3em">
            <Stack alignItems="center">
              {activeItem.isAnswered && (
                <Badge variant="solid" bg="accent.forestGreen">
                  <TickIcon w="1rem" h="1rem" fill="white" stroke="white" />
                  Answered
                </Badge>
              )}
              <Heading as="h2" textAlign="center">
                {activeItem.title}
              </Heading>
            </Stack>
            <Stack gap="1em">
              <Flex w="full" gap="1em">
                {activeItem.hint && (
                  <Tooltip
                    content={activeItem.hint}
                    open={showHint}
                    onOpenChange={({ open }) => setShowHint(open)}
                  >
                    <Button
                      variant="secondary"
                      flex="100%"
                      onClick={() => setShowHint(true)}
                    >
                      💡 Hint
                    </Button>
                  </Tooltip>
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
                <AnswerForm questionItem={activeItem} />
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

function AnswerForm({ questionItem }: { questionItem: ReviewLearnItem }) {
  if (questionItem.answerType === "multiple-choices")
    return (
      <MultipleChoicesField
        answer={questionItem.submittedAnswer || ""}
        options={questionItem.options as string[]}
      />
    );

  if (questionItem.answerType === "true-false")
    return (
      <TrueFalseField
        answer={questionItem.submittedAnswer as "true" | "false"}
      />
    );

  return (
    <Textarea
      id="answer"
      name="answer"
      defaultValue={questionItem.submittedAnswer || ""}
      h="8em"
    />
  );
}

function TrueFalseField({ answer }: { answer: "true" | "false" }) {
  const [value, setValue] = React.useState<string>(answer);

  return (
    <>
      <Input hidden={true} id="answer" name="answer" value={value} />
      <RadioCardRoot
        w="full"
        gap={0}
        flexDirection="row"
        value={value}
        onValueChange={({ value }) => setValue(value as string)}
      >
        <RadioCardItem
          alignItems="center"
          borderRadius="none"
          indicator={null}
          value="true"
          label="True"
        />
        <RadioCardItem
          alignItems="center"
          borderRadius="none"
          indicator={null}
          value="false"
          label="False"
        />
      </RadioCardRoot>
    </>
  );
}

function MultipleChoicesField({
  options,
  answer,
}: {
  options: readonly string[];
  answer: string;
}) {
  const [value, setValue] = React.useState(answer);

  const collection = createListCollection({
    items: options,
  });

  return (
    <>
      <Input hidden={true} value={value} id="answer" name="answer" />
      <Field w="full">
        <SelectRoot
          required={true}
          collection={collection}
          value={[value]}
          onValueChange={({ value }) => setValue(value[0])}
        >
          <SelectLabel textStyle="sm-semibold">Answer</SelectLabel>
          <SelectTrigger>{value}</SelectTrigger>
          <SelectContent portalled={false}>
            {collection.items.map((option) => {
              return (
                <SelectItem key={option} item={option}>
                  {option}
                </SelectItem>
              );
            })}
          </SelectContent>
        </SelectRoot>
      </Field>
    </>
  );
}
