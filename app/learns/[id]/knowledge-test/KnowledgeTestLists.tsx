"use client";

import { Stack } from "@chakra-ui/react";
import { FlashcardsList } from "./_flash-cards";
import { AnswerType, Flashcard } from "./_flash-cards/types";
import { FlashCard, PracticeTask } from "@/generated/prisma/client";
import React from "react";
import { PracticeTasksList } from "./_practice-tasks";
import SearchInput from "@/components/input/search";

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

  const { flashcards, practiceTasks, search } = useKnowledgeTest(props);

  return (
    <Stack gap="2em">
      <SearchInput
        onChange={(e) => search(e.target.value)}
        placeholder="Search by title, question or stage"
      />
      <FlashcardsList flashCards={flashcards} learnId={learnId} />
      <PracticeTasksList practiceTasks={practiceTasks} learnId={learnId} />
    </Stack>
  );
}

type UseKnowledgeTestReturn = {
  flashcards: Flashcard[];
  practiceTasks: PracticeTask[];
  search: (query: string) => void;
};
function useKnowledgeTest(props: {
  flashcards: FlashCard[];
  practiceTasks: PracticeTask[];
}): UseKnowledgeTestReturn {
  const [flashcards, setFlashcards] = React.useState<Flashcard[]>(
    props.flashcards.map(mapToFlashcard) || []
  );

  const [practiceTasks, setPracticeTasks] = React.useState<PracticeTask[]>(
    props.practiceTasks || []
  );

  const [search, setSearch] = React.useState<string>("");

  React.useEffect(
    function reset() {
      setFlashcards(props.flashcards.map(mapToFlashcard));
    },
    [props.flashcards]
  );

  React.useEffect(
    function reset() {
      setPracticeTasks(props.practiceTasks);
    },
    [props.practiceTasks]
  );

  const query = search.toLowerCase();
  const flashcardSearchResult = flashcards.filter(
    ({ question, stage }) =>
      question.toLocaleLowerCase().includes(query) ||
      stage?.toLocaleLowerCase().includes(query)
  );
  const practiceTaskSearchResult = practiceTasks.filter(
    ({ title, stage }) =>
      title.toLocaleLowerCase().includes(query) ||
      stage?.toLocaleLowerCase().includes(query)
  );

  return {
    flashcards: flashcardSearchResult,
    practiceTasks: practiceTaskSearchResult,
    search: (query: string) => setSearch(query),
  };
}
