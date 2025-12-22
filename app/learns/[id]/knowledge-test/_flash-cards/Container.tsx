"use client";

import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Stack,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { Create } from "./Create";
import React from "react";
import { Flashcard } from "./actions";
import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselRoot,
} from "@/components/ui/carousel";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Update } from "./Update";
import { Remove } from "./Remove";
import { dateDiffInDays } from "@/util/date";

export function Container(props: { learnId: number; flashCards: Flashcard[] }) {
  const [flashCards, setFlashCards] = React.useState<Flashcard[]>(
    props.flashCards || []
  );

  React.useEffect(
    function reset() {
      setFlashCards(props.flashCards);
    },
    [props.flashCards]
  );

  const currentBreakpoint = useBreakpointValue({
    base: "base",
    sm: "sm",
    md: "md",
  });

  return (
    <CarouselRoot
      slideCount={flashCards.length}
      slidesPerPage={
        currentBreakpoint === "base" ? 1 : currentBreakpoint === "sm" ? 2 : 3
      }
      gap="3"
    >
      <Wrap gap="1em" alignItems="center" justifyContent="space-between">
        <Create learnId={props.learnId} />
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
        {flashCards.map((f, index) => {
          return (
            <CarouselItem key={f.id} index={index}>
              <Card.Root>
                <Card.Header>
                  <Heading
                    as="h5"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {f.question}
                  </Heading>
                </Card.Header>
                <Card.Body>
                  <Wrap
                    gap="1em"
                    alignItems="flex-end"
                    justifyContent="space-between"
                  >
                    <Stack>
                      <Box textStyle="sm-medium" color="text.caption">
                        Due: in {dateDiffInDays(f.due, new Date())} days
                      </Box>
                      <Box textStyle="sm-medium" color="text.caption">
                        Stage: #{f.stage}
                      </Box>
                    </Stack>
                    <Flex alignItems="center">
                      <Update flashCard={f} />
                      <Remove id={f.id} />
                    </Flex>
                  </Wrap>
                </Card.Body>
              </Card.Root>
            </CarouselItem>
          );
        })}
      </CarouselItemGroup>
    </CarouselRoot>
  );
}
