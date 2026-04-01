"use client";

import React from "react";
import {
  Badge,
  Button,
  createListCollection,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
  Text,
  Box,
  useBreakpointValue,
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
    }),
  );

  const router = useRouter();

  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(
    function startFromFirstUnansweredQuestion() {
      const index = questions.findIndex((q) => !q.isAnswered);
      return index < 0 ? 0 : index;
    },
  );
  const [state, action, loading] = React.useActionState(
    submitAnswer,
    undefined,
  );

  const [openAnswer, setOpenAnswer] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

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
    <Box display="flex" flexDirection="column" h="100%" pt="4em" gap="5em">
      {/* Pagination strip: full width + edge padding on mobile, centered 40em on desktop */}
      <Box
        w="100%"
        maxW={{ base: "100%", md: "80em" }}
        ms={{ base: "0", md: openAnswer ? "0" : "auto" }}
        me="auto"
        transition="margin 0.3s ease-in-out"
      >
        <ItemNavigatorStrip
          questions={questions}
          activeItemIndex={activeItemIndex}
          onNavigate={setActiveItemIndex}
        />
      </Box>

      {/* Form: always centered */}
      <Box
        flex="1"
        w="100%"
        maxW="40em"
        ms={{ base: "auto", md: openAnswer ? "0" : "auto" }}
        me="auto"
        transition="margin 0.3s ease-in-out"
        overflow="auto"
      >
        <form action={action} style={{ height: "100%" }}>
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
          <Stack justifyContent="space-between" h="full" pb="4em">
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
      </Box>

      <ShowAnswer
        answer={activeItem.answer}
        open={openAnswer}
        onClose={() => setOpenAnswer(false)}
      />
    </Box>
  );
}

function ItemNavigatorStrip({
  questions,
  activeItemIndex,
  onNavigate,
}: {
  questions: ReviewLearnItem[];
  activeItemIndex: number;
  onNavigate: (index: number) => void;
}) {
  const n = questions.length;

  const itemsPerPage = useBreakpointValue({ base: 2, md: 3 }) ?? 3;

  const [windowStart, setWindowStart] = React.useState(
    () => Math.floor(activeItemIndex / 3) * 3,
  );
  const [animKey, setAnimKey] = React.useState(0);
  const [slideDir, setSlideDir] = React.useState<"left" | "right">("left");

  // Keep a ref so the effect below can compare without stale closure issues
  const windowStartRef = React.useRef(windowStart);
  React.useLayoutEffect(() => {
    windowStartRef.current = windowStart;
  });

  // Sync window when activeItemIndex changes externally (e.g. form submission)
  React.useEffect(() => {
    const newPage = Math.floor(activeItemIndex / itemsPerPage) * itemsPerPage;
    if (newPage !== windowStartRef.current) {
      setSlideDir(activeItemIndex > windowStartRef.current ? "left" : "right");
      setWindowStart(newPage);
      setAnimKey((k) => k + 1);
    }
  }, [activeItemIndex, itemsPerPage]);

  // Re-align window when items-per-page changes (e.g. viewport resize)
  React.useEffect(() => {
    const newPage = Math.floor(activeItemIndex / itemsPerPage) * itemsPerPage;
    setWindowStart(newPage);
  }, [itemsPerPage, activeItemIndex]);

  const canGoNext = windowStart + itemsPerPage < n;
  const canGoPrev = windowStart > 0;

  const goNext = () => {
    if (!canGoNext) return;
    const newStart = windowStart + itemsPerPage;
    setSlideDir("left");
    setWindowStart(newStart);
    setAnimKey((k) => k + 1);
    onNavigate(newStart);
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    const newStart = windowStart - itemsPerPage;
    setSlideDir("right");
    setWindowStart(newStart);
    setAnimKey((k) => k + 1);
    onNavigate(newStart);
  };

  const windowIndices = Array.from({ length: itemsPerPage }, (_, i) => {
    const idx = windowStart + i;
    return idx < n ? idx : null;
  });

  const slideAnimation =
    slideDir === "left"
      ? "itemNavSlideFromRight 0.28s ease forwards"
      : "itemNavSlideFromLeft 0.28s ease forwards";

  return (
    <>
      <style>{`
        @keyframes itemNavSlideFromRight {
          from { transform: translateX(48px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes itemNavSlideFromLeft {
          from { transform: translateX(-48px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
      <Flex align="center" w="100%">
        <Button
          variant="ghost"
          size="sm"
          px="0.25em"
          disabled={!canGoPrev}
          onClick={goPrev}
          aria-label="Previous"
        >
          {"<"}
        </Button>

        <Box flex="1" overflow="hidden">
          <Flex key={animKey} gap="0.5em" style={{ animation: slideAnimation }}>
            {windowIndices.map((idx, slot) => {
              if (idx === null) {
                return <Box key={`empty-${slot}`} flex="1" />;
              }
              const item = questions[idx];
              const isActive = idx === activeItemIndex;
              const isAnswered = item.isAnswered;

              return (
                <Flex
                  key={idx}
                  flex="1"
                  h="8em"
                  alignItems="center"
                  justifyContent="center"
                  minW={0}
                  px="0.75em"
                  py="0.6em"
                  borderRadius="md"
                  border={isActive ? "2px solid" : "1px solid"}
                  borderColor={isActive ? "green.500" : "gray.200"}
                  bg={isAnswered && !isActive ? "green.50" : "white"}
                  cursor="pointer"
                  onClick={() => onNavigate(idx)}
                  overflow="hidden"
                >
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight={isActive ? "semibold" : "normal"}
                    color={isActive ? "green.600" : "inherit"}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.title}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Box>

        <Button
          variant="ghost"
          size="sm"
          px="0.25em"
          disabled={!canGoNext}
          onClick={goNext}
          aria-label="Next"
        >
          {">"}
        </Button>
      </Flex>
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
