"use client";

import { Stack } from "@chakra-ui/react";
import { FlashcardsList } from "./_flash-cards/List";
import { AnswerType, Flashcard } from "./_flash-cards/types";
import { FlashCard, PracticeTask } from "@/generated/prisma/client";
import React from "react";

function mapToFlashcard(flashcard: FlashCard) {
  return {
    ...flashcard,
    options: flashcard.options as string[],
    answerType: flashcard.answerType as AnswerType,
  };
}

export function KnowledgeTestLists(props: {
  flashcards: FlashCard[];
  practiceTasks: PracticeTask[];
  learnId: number;
}) {
  const { learnId } = props;

  const [flashCards, setFlashCards] = React.useState<Flashcard[]>(
    props.flashcards.map(mapToFlashcard) || []
  );

  React.useEffect(
    function reset() {
      setFlashCards(props.flashcards.map(mapToFlashcard));
    },
    [props.flashcards]
  );

  return (
    <Stack gap="2em">
      <FlashcardsList flashCards={flashCards} learnId={learnId} />
      {/* <PracticeTasksList practiceTasks={practiceTasks} learnId={learnId} /> */}
    </Stack>
  );
}
