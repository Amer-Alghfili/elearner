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
import { PracticeTask } from "./actions";
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

export function Container(props: {
  learnId: number;
  practiceTasks: PracticeTask[];
}) {
  const [practiceTasks, setPracticeTasks] = React.useState<PracticeTask[]>(
    props.practiceTasks || []
  );

  React.useEffect(
    function reset() {
      setPracticeTasks(props.practiceTasks);
    },
    [props.practiceTasks]
  );

  const currentBreakpoint = useBreakpointValue({
    base: "base",
    sm: "sm",
    md: "md",
  });

  return (
    <CarouselRoot
      slideCount={practiceTasks.length}
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
        {practiceTasks.map((p, index) => {
          return (
            <CarouselItem key={p.id} index={index}>
              <Card.Root>
                <Card.Header>
                  <Heading
                    as="h5"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {p.title}
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
                        Due: in {dateDiffInDays(p.due, new Date())} days
                      </Box>
                      <Box textStyle="sm-medium" color="text.caption">
                        Stage: #{p.stage}
                      </Box>
                    </Stack>
                    <Flex alignItems="center">
                      <Update learnId={props.learnId} practiceTask={p} />
                      <Remove id={p.id} />
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
