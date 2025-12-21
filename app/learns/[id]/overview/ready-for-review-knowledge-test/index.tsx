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
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PracticeTask } from "../../knowledge-test/_practice-tasks/actions";
import { Flashcard } from "../../knowledge-test/_flash-cards/actions";

type KnowledgeTest = {
  id: number;
  type: "flashcard" | "practice-task";
  title: string;
};
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

  const list: KnowledgeTest[] = [
    ...(practiceTasks.map((p) => ({
      id: p.id,
      title: p.title,
      type: "practice-task",
    })) as KnowledgeTest[]),
    ...(flashcards.map((f) => ({
      id: f.id,
      title: f.question,
      type: "flashcard",
    })) as KnowledgeTest[]),
  ];

  return (
    <CarouselRoot
      slideCount={list.length}
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
        {list.map((f, index) => {
          return (
            <CarouselItem key={f.id} index={index}>
              <Card.Root>
                <Card.Header pt="1em" pb={0}>
                  <Heading
                    as="h5"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {f.title}
                  </Heading>
                </Card.Header>
                <Card.Body py="1em">
                  <Button
                    variant="plain"
                    size="sm"
                    alignSelf="flex-end"
                    color="primary"
                    textDecoration="underline"
                  >
                    Start
                  </Button>
                </Card.Body>
              </Card.Root>
            </CarouselItem>
          );
        })}
      </CarouselItemGroup>
    </CarouselRoot>
  );
}
