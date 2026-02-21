import { auth } from "@/auth";
import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import { prisma } from "@/prisma";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { ar } from "zod/v4/locales";

export type ReviewLearnsPageType = {
  id: number;
  title: string;
  total: number;
  reviewedCount: number;
}[];
export default async function ReviewLearnsPage() {
  const userAuth = await auth();
  const email = userAuth?.user?.email;

  const learns = await prisma.learn.findMany({
    select: {
      id: true,
    },
    where: {
      user_id: email as string,
    },
  });

  if (learns.length === 0) return;

  const list: ReviewLearnsPageType = [];

  const today = new Date();

  const learnIds = learns.map(({ id }) => id);
  for (const id of learnIds) {
    const activeFlashcards = await prisma.flashCard.findMany({
      where: {
        learn_id: id,
        OR: [{ due: { lte: today } }, { answeredAt: today }],
      },
      include: {
        learn: { select: { title: true } },
      },
    });

    const activePracticeTasks = await prisma.practiceTask.findMany({
      where: {
        learn_id: id,
        OR: [{ due: { lte: today } }, { answeredAt: today }],
      },
      include: {
        learn: { select: { title: true } },
      },
    });

    if (activeFlashcards.length) {
      const reviewedCount = activeFlashcards.filter(
        (f) =>
          f.answeredAt != null &&
          f.answeredAt.getFullYear() === today.getFullYear() &&
          f.answeredAt.getMonth() === today.getMonth() &&
          f.answeredAt.getDate() === today.getDate()
      ).length;

      list.push({
        id,
        title: activeFlashcards[0].learn.title,
        total: activeFlashcards.length,
        reviewedCount,
      });
    }

    if (activePracticeTasks.length) {
      const reviewedCount = activePracticeTasks.filter(
        (f) =>
          f.answeredAt != null &&
          f.answeredAt.getFullYear() === today.getFullYear() &&
          f.answeredAt.getMonth() === today.getMonth() &&
          f.answeredAt.getDate() === today.getDate()
      ).length;

      list.push({
        id,
        title: activePracticeTasks[0].learn.title,
        total: activePracticeTasks.length,
        reviewedCount,
      });
    }
  }

  return (
    <Scaffold>
      <Header />
      <Stack mt="6.4375em" alignItems="flex-start" gap="2em">
        {list.map(({ id, title, total, reviewedCount }) => {
          const progress = (reviewedCount / total) * 100;

          return (
            <Card.Root
              key={id}
              w="full"
              h="10em"
              bg={progress === 100 ? "accent.dustyPlum.transparent" : ""}
            >
              <Card.Header>
                <Heading as="h5">
                  <Flex justifyContent="space-between">
                    {title}{" "}
                    {progress === 100 && <Box fontSize="1.8rem">🎉</Box>}
                  </Flex>
                </Heading>
              </Card.Header>
              <Card.Body justifyContent="flex-end">
                <Flex
                  alignItems="center"
                  gap="1em"
                  justifyContent="space-between"
                >
                  {reviewedCount > 0 && (
                    <ProgressRoot w="70%" value={progress}>
                      <Flex gap="1em">
                        <ProgressBar flex={1} />
                        <ProgressValueText>{`${reviewedCount} of ${total}`}</ProgressValueText>
                      </Flex>
                    </ProgressRoot>
                  )}
                  {reviewedCount !== total && (
                    <Button asChild minW="8em" ms="auto">
                      <Link href={`/review-learns/${id}`}>
                        {reviewedCount > 0 ? "Continue" : "Start"}
                      </Link>
                    </Button>
                  )}
                </Flex>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Stack>
    </Scaffold>
  );
}
