"use client";

import React from "react";
import {
  Badge,
  Box,
  Button,
  createListCollection,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { submitAnswer } from "./action";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { ShowAnswer } from "./ShowAnswer";
import { Tooltip } from "@/components/ui/tooltip";
import { BurgerIcon, TickIcon } from "@/components/Icons";
import { LuArrowLeft } from "react-icons/lu";
import NextLink from "next/link";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";

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
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

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
        if (
          inState.data.answer ||
          questions[activeItemIndex].type === "practiceTask"
        ) {
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
      <IconButton
        asChild
        h="auto"
        ms={{ base: 0, md: sidebarExpanded ? "16rem" : 0 }}
        border="none"
        variant="plain"
        textStyle="sm"
        fontWeight="medium"
      >
        <NextLink href="/home">
          <LuArrowLeft />
          Go Home
        </NextLink>
      </IconButton>
      <ReviewSidebar
        questions={questions}
        activeItemIndex={activeItemIndex}
        expanded={sidebarExpanded}
        onToggle={toggleSidebar}
        onNavigate={setActiveItemIndex}
      />
      <ReviewMobileDrawer
        questions={questions}
        activeItemIndex={activeItemIndex}
        onNavigate={setActiveItemIndex}
      />

      {/* Main content — offset by sidebar on desktop */}
      <Box
        display="flex"
        flexDirection="column"
        h="100%"
        pt="4em"
        gap="5em"
        ps={{ base: 0, md: sidebarExpanded ? "20rem" : "4rem" }}
        transition="padding-left 0.3s ease-in-out"
      >
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
            <Input
              id="type"
              name="type"
              hidden={true}
              value={activeItem.type}
            />
            <Input id="id" name="id" hidden={true} value={activeItem.id} />
            <Input
              id="stage"
              name="stage"
              hidden={true}
              value={
                activeItem.stage === 4 ? activeItem.stage : activeItem.stage + 1
              }
            />
            <Stack justifyContent="center" h="full" pb="4em" gap="4em">
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
                    {activeItem.type === "practiceTask" ? (
                      <PracticeTaskItem
                        key={activeItem.answer}
                        description={activeItem.answer}
                      />
                    ) : (
                      <Button
                        onClick={() => {
                          setOpenAnswer(true);
                          setSidebarExpanded(false);
                        }}
                        variant="secondary"
                        flex="100%"
                      >
                        Show Answer
                      </Button>
                    )}
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
          onClose={() => {
            setOpenAnswer(false);
            setSidebarExpanded(true);
          }}
        />
      </Box>
    </>
  );
}

function PracticeTaskItem({ description }: { description: string }) {
  const editor = useElearnerCreateBlockNote({
    initialContent: null,
  });

  const convertHtmlToBlocks = React.useEffectEvent((description: string) => {
    const blocks = editor.tryParseHTMLToBlocks(description);
    editor.replaceBlocks(editor.document, blocks);
  });

  React.useEffect(
    function () {
      convertHtmlToBlocks(description);
    },
    [description],
  );

  return <ElearnerNoteEditor editor={editor} editable={false} />;
}

function questionTypeLabel(item: ReviewLearnItem): string {
  if (item.type === "practiceTask") return "Practice Task";
  if (item.answerType === "multiple-choices") return "Multiple Choices";
  if (item.answerType === "true-false") return "True / False";
  return "Open Ended";
}

function QuestionList({
  questions,
  activeItemIndex,
  onNavigate,
}: {
  questions: ReviewLearnItem[];
  activeItemIndex: number;
  onNavigate: (index: number) => void;
}) {
  const activeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);

  return (
    <Stack gap="0.75em" overflow="auto">
      <Heading as="h3" textStyle="md-semibold">
        Questions({questions.length})
      </Heading>
      {questions.map((item, index) => {
        const isSelected = index === activeItemIndex;
        const isAnswered = item.isAnswered;

        return (
          <Box
            as="button"
            ref={isSelected ? activeRef : undefined}
            key={index}
            cursor="pointer"
            textAlign="start"
            w="full"
            bg="none"
            border="none"
            p={0}
            onClick={() => onNavigate(index)}
          >
            <Stack
              gap="1em"
              px="0.75em"
              py="1em"
              borderWidth="1px"
              borderColor={isSelected ? "gray.400" : "stroke.transparent"}
              borderRadius="md"
              bg="neutral.background"
            >
              <Flex gap="0.5em" alignItems="center">
                <Badge
                  size="sm"
                  bg={
                    isAnswered
                      ? "accent.forestGreen.transparent"
                      : "neutral.surface"
                  }
                  borderColor="stroke.transparent"
                  borderWidth={isAnswered ? "none" : "1px"}
                  color={isAnswered ? "white" : "text.primary"}
                  minW="2em"
                  justifyContent="center"
                >
                  {index + 1}
                </Badge>
                <Text textStyle="sm" truncate>
                  {item.title}
                </Text>
              </Flex>
              <Badge size="xs" alignSelf="flex-start" bg="stroke.transparent">
                {questionTypeLabel(item)}
              </Badge>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

function ReviewSidebar({
  questions,
  activeItemIndex,
  expanded,
  onToggle,
  onNavigate,
}: {
  questions: ReviewLearnItem[];
  activeItemIndex: number;
  expanded: boolean;
  onToggle: VoidFunction;
  onNavigate: (index: number) => void;
}) {
  return (
    <Stack
      display={{ base: "none", md: "flex" }}
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w={expanded ? "20rem" : "4rem"}
      px={expanded ? "1.5em" : 0}
      py="2em"
      gap="2em"
      borderWidth="1px"
      borderColor="stroke"
      bg="neutral.surface"
      transition="width 0.3s ease-in-out"
    >
      <Flex
        justifyContent={expanded ? "flex-end" : "center"}
        alignItems="center"
      >
        <IconButton h="auto" border="none" variant="plain" onClick={onToggle}>
          <BurgerIcon />
        </IconButton>
      </Flex>
      {expanded && (
        <QuestionList
          questions={questions}
          activeItemIndex={activeItemIndex}
          onNavigate={onNavigate}
        />
      )}
    </Stack>
  );
}

function ReviewMobileDrawer({
  questions,
  activeItemIndex,
  onNavigate,
}: {
  questions: ReviewLearnItem[];
  activeItemIndex: number;
  onNavigate: (index: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Flex
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="1.8em"
        left="1em"
        zIndex="overlay"
        gap="0.25em"
      >
        <IconButton
          h="auto"
          border="none"
          variant="plain"
          onClick={() => setOpen(true)}
        >
          <BurgerIcon />
        </IconButton>
      </Flex>

      <DrawerRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        placement="start"
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent bg="neutral.surface" maxW="20rem">
            <DrawerHeader>
              <DrawerCloseTrigger />
            </DrawerHeader>
            <DrawerBody>
              <QuestionList
                questions={questions}
                activeItemIndex={activeItemIndex}
                onNavigate={onNavigate}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
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
      key={questionItem.id}
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
