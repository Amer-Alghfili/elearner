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
import React from "react";
import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselRoot,
} from "@/components/ui/carousel";
import { LuChevronLeft, LuChevronRight, LuTrash } from "react-icons/lu";
import { dateDiffInDays } from "@/util/date";
import { Flashcard } from "./types";
import AddButton from "@/components/button/add";
import Upsert from "./upsert";
import { EditIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { deleteFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import RemoveButton from "@/components/button/remove";

export function FlashcardsList({
  flashCards,
  learnId,
}: {
  learnId: number;
  flashCards: Flashcard[];
}) {
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
              {flashCards.length}
            </Box>
          </Text>
        </Stack>
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

function Create({ learnId }: { learnId: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Flash Card
      </AddButton>
      <Upsert
        key={open.toString()}
        defaultValues={{ learn_id: learnId }}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

function Update({ flashCard }: { flashCard: Flashcard }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        variant="plain"
        p={0}
        minW="2rem"
        h="2rem"
        _hover={{ bg: "primary.transparent" }}
      >
        <EditIcon w="1.2rem" h="1.2rem" />
      </IconButton>
      <Upsert
        key={open.toString()}
        open={open}
        setOpen={setOpen}
        defaultValues={flashCard}
      />
    </>
  );
}

function Remove({ id }: { id: number }) {
  const router = useRouter();

  const [state, action, loading] = React.useActionState(
    deleteFlashCard,
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
        title: "Flash card has been deleted successfully",
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
