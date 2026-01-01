"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { Create } from "./Create";
import React from "react";
import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselRoot,
} from "@/components/ui/carousel";
import { LuChevronLeft, LuChevronRight, LuTrash } from "react-icons/lu";
import { Update } from "./Update";
import { dateDiffInDays } from "@/util/date";
import { PracticeTask } from "./types";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { deletePracticeTask } from "./actions";
import RemoveButton from "@/components/button/remove";

export function PracticeTasksList({
  learnId,
  practiceTasks,
}: {
  learnId: number;
  practiceTasks: PracticeTask[];
}) {
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
        <Create learnId={learnId} />
        <Stack alignItems="flex-end">
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
          <Text textStyle="sm" color="text.caption">
            Total:{" "}
            <Box as="span" fontWeight="bold">
              {practiceTasks.length}
            </Box>
          </Text>
        </Stack>
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
                      <Update learnId={learnId} practiceTask={p} />
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

function Remove({ id }: { id: number }) {
  const router = useRouter();

  const [state, action, loading] = React.useActionState(
    deletePracticeTask,
    undefined
  );

  React.useEffect(
    function reset() {
      if (state == null) return;

      if (state.error) {
        toaster.create({
          title: state.error,
          type: "error",
          closable: true,
        });

        return;
      }

      router.refresh();

      toaster.create({
        title: "Practice task has been deleted successfully",
        type: "success",
        closable: true,
      });
    },
    [state]
  );

  return (
    <RemoveButton
      className="group"
      _hover={{ bg: "stroke" }}
      minW="2rem"
      h="2rem"
      icon={
        <Icon color="accent.softCoral" w="1.2rem" h="1.2rem">
          <LuTrash />
        </Icon>
      }
    >
      <form action={action}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" loading={loading} bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}
