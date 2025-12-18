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
    <Stack>
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
                  <Card.Header
                    flexDirection="row"
                    alignItems="center"
                    gap="1em"
                    justifyContent="space-between"
                  >
                    <Heading as="h4">{p.title}</Heading>
                    <Box color="text.secondary">
                      Stage: #
                      <Box as="span" fontWeight="bold">
                        {p.stage}
                      </Box>
                    </Box>
                  </Card.Header>
                  <Card.Body>
                    <Box textStyle="sm-medium" color="text.caption">
                      Due: {p.due.toLocaleDateString()}
                    </Box>
                  </Card.Body>
                </Card.Root>
              </CarouselItem>
            );
          })}
        </CarouselItemGroup>
      </CarouselRoot>
    </Stack>
  );
}
