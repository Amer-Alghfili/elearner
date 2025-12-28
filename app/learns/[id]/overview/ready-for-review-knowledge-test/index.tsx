"use client";

import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselRoot,
} from "@/components/ui/carousel";
import {
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PracticeTask } from "../../knowledge-test/_practice-tasks/actions";
import { PracticeTaskItem } from "./PracticeTaskItem";
import { FlashcardItem } from "./FlashcardItem";
import { Flashcard } from "../../knowledge-test/_flash-cards/types";

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
        {flashcards.map((flashcard, index) => {
          return (
            <CarouselItem key={flashcard.id} index={index}>
              <FlashcardItem flashcard={flashcard} />
            </CarouselItem>
          );
        })}
      </CarouselItemGroup>
    </CarouselRoot>
  );
}
