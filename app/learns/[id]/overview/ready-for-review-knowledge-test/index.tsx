"use client";

import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselRoot,
} from "@/components/ui/carousel";
import {
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Stack,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PracticeTask } from "../../knowledge-test/_practice-tasks/actions";
import { Flashcard } from "../../knowledge-test/_flash-cards/actions";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/editor/ElearnerNoteEditor";

export function ReadyToReviewKnowledgeTest({
  practiceTasks,
  flashcards,
}: {
  practiceTasks: PracticeTask[];
  flashcards: Flashcard[];
}) {
  const currentBreakpoint = useBreakpointValue({
    base: "base",
    sm: "sm",
    md: "md",
  });

  return (
    <CarouselRoot
      slideCount={practiceTasks.length + flashcards.length}
      slidesPerPage={
        currentBreakpoint === "base" ? 1 : currentBreakpoint === "sm" ? 2 : 3
      }
      gap="3"
    >
      <Wrap gap="1em" alignItems="center" justifyContent="space-between">
        <Heading as="h4">Ready for review</Heading>
        <Flex>
          <CarouselPrevTrigger asChild>
            <IconButton size="xs" variant="subtle">
              <LuChevronLeft />
            </IconButton>
          </CarouselPrevTrigger>
          <CarouselNextTrigger asChild>
            <IconButton size="xs" variant="subtle">
              <LuChevronRight />
            </IconButton>
          </CarouselNextTrigger>
        </Flex>
      </Wrap>

      <CarouselItemGroup>
        {practiceTasks.map((practiceTask, index) => {
          return (
            <CarouselItem key={practiceTask.id} index={index}>
              <PracticeTaskItem practiceTask={practiceTask} />
            </CarouselItem>
          );
        })}
      </CarouselItemGroup>
    </CarouselRoot>
  );
}

function PracticeTaskItem({ practiceTask }: { practiceTask: PracticeTask }) {
  const { description } = practiceTask;

  const [flip, setFlip] = React.useState(false);

  const editor = useElearnerCreateBlockNote({
    initialContent: null,
  });

  React.useEffect(
    function convertHtmlToBlocks() {
      const blocks = editor.tryParseHTMLToBlocks(description);
      editor.replaceBlocks(editor.document, blocks);
    },
    [description]
  );

  const front = (
    <Stack
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
    >
      <DialogBody overflow={!flip ? "auto" : "visible"}>
        <Flex justifyContent="center">
          <ElearnerNoteEditor editor={editor} editable={false} />
        </Flex>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogActionTrigger>
        <Button onClick={() => setFlip((prev) => !prev)}>Finish</Button>
      </DialogFooter>
    </Stack>
  );

  const back = (
    <Stack
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
      transform="rotateY(180deg)"
    >
      <DialogBody overflow={flip ? "auto" : "visible"}>
        <Flex justifyContent="center">
          <ElearnerNoteEditor editor={editor} editable={false} />
        </Flex>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogActionTrigger>
        <Button onClick={() => setFlip((prev) => !prev)}>Finish</Button>
      </DialogFooter>
    </Stack>
  );

  return (
    <Card.Root bg="transparent">
      <Card.Header pt="1em" pb={0}>
        <Heading
          as="h5"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {practiceTask.title}
        </Heading>
      </Card.Header>
      <Card.Body py="1em">
        <DialogRoot onOpenChange={({ open }) => !open && setFlip(false)}>
          <DialogTrigger asChild>
            <Button variant="plain" color="primary" alignSelf="flex-end">
              Start
            </Button>
          </DialogTrigger>
          <DialogContent
            w="50vw"
            h="90vh"
            mt="2em"
            maxW="none"
            maxH="none"
            justifyContent="center"
            alignItems="center"
            perspective="2000px"
            bg="transparent"
            boxShadow="none"
          >
            <Stack
              transition="all 0.5s ease-in-out"
              transform={flip ? "rotateY(180deg)" : "rotateY(0)"}
              transformStyle="preserve-3d"
              position="relative"
              bg="white"
              w="full"
              h="full"
              borderRadius="8px"
              boxShadow="md"
            >
              {front}
              {back}
            </Stack>
          </DialogContent>
        </DialogRoot>
      </Card.Body>
    </Card.Root>
  );
}
