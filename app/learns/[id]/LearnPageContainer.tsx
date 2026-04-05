"use client";

import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import Header from "@/components/Header";
import { FlashcardForm } from "./_flashcard-form";
import { Flashcard } from "./_flashcard-form/types";
import { PracticeTask } from "./_practice-task-form/types";
import { PracticeTaskForm } from "./_practice-task-form";
import {
  useLearnNotebooks,
  LearnNotebooksAPI,
  NotebookSummary,
} from "./useLearnNotebooks";

type FlashcardFormType = { flashcard?: Flashcard; open: boolean };
type PracticeTaskFormType = { practiceTask?: PracticeTask; open: boolean };
const LearnControlManagementContext = React.createContext<{
  sidebarExpanded: boolean;
  flashcardForm: FlashcardFormType;
  toggleFlashcardForm: ({ flashcard }: { flashcard?: Flashcard }) => void;
  practiceTaskForm: PracticeTaskFormType;
  togglePracticeTaskForm: ({
    practiceTask,
  }: {
    practiceTask?: PracticeTask;
  }) => void;
  toggleSidebar: VoidFunction;
}>({
  sidebarExpanded: true,
  flashcardForm: { open: false },
  toggleFlashcardForm: () => {},
  practiceTaskForm: { open: false },
  togglePracticeTaskForm: () => {},
  toggleSidebar: () => {},
});

export function useLearnControlManagement() {
  return React.useContext(LearnControlManagementContext);
}

const LearnNotebooksContext = React.createContext<LearnNotebooksAPI>(
  {} as LearnNotebooksAPI,
);

export function useLearnNotebooksContext() {
  return React.useContext(LearnNotebooksContext);
}

export function LearnPageContainer({
  learnId,
  knowledgeItemsCount,
  initialNotebooks,
  Sidebar,
  children,
}: {
  learnId: number;
  knowledgeItemsCount: number;
  initialNotebooks: NotebookSummary[];
  Sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const learnNotebooks = useLearnNotebooks(initialNotebooks);
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [flashcardForm, setFlashcardForm] = React.useState<FlashcardFormType>({
    open: false,
  });
  const [practiceTaskForm, setPracticeTaskForm] =
    React.useState<PracticeTaskFormType>({
      open: false,
    });

  const sidebarAlreadyCollapsed = React.useRef<boolean>(false);

  function expandSidebar() {
    setSidebarExpanded(true);
    setFlashcardForm({ open: false });
    setPracticeTaskForm({ open: false });
    sidebarAlreadyCollapsed.current = false;
  }

  function collapseSidebar() {
    setSidebarExpanded(false);
    sidebarAlreadyCollapsed.current = true;
  }

  function openFlashcardForm({ flashcard }: { flashcard?: Flashcard } = {}) {
    setSidebarExpanded(false);
    setPracticeTaskForm({ open: false });

    const obj: FlashcardFormType = { open: true };
    if (flashcard) {
      obj.flashcard = { ...flashcard };
    }

    setFlashcardForm(obj);
  }

  function openPracticeTaskForm({
    practiceTask,
  }: { practiceTask?: PracticeTask } = {}) {
    setSidebarExpanded(false);
    setFlashcardForm({ open: false });

    const obj: PracticeTaskFormType = { open: true };
    if (practiceTask) {
      obj.practiceTask = { ...practiceTask };
    }

    setPracticeTaskForm(obj);
  }

  function closeFlashcardForm() {
    setFlashcardForm({ open: false });
    // expand sidebar if it was not already collapsed by the user
    if (!sidebarAlreadyCollapsed.current) {
      setSidebarExpanded(true);
    }
  }

  function closePracticeTaskForm() {
    setPracticeTaskForm({ open: false });
    // expand sidebar if it was not already collapsed by the user
    if (!sidebarAlreadyCollapsed.current) {
      setSidebarExpanded(true);
    }
  }

  function toggleFlashcardForm({ flashcard }: { flashcard?: Flashcard } = {}) {
    if (flashcardForm.open) {
      if (flashcard == null) {
        closeFlashcardForm();
        return;
      }
    }

    openFlashcardForm({ flashcard });
  }

  function togglePracticeTaskForm({
    practiceTask,
  }: { practiceTask?: PracticeTask } = {}) {
    if (practiceTaskForm.open) {
      if (practiceTask == null) {
        closePracticeTaskForm();
        return;
      }
    }

    openPracticeTaskForm({ practiceTask });
  }

  function toggleSidebar() {
    if (sidebarExpanded) collapseSidebar();
    else expandSidebar();
  }

  return (
    <LearnNotebooksContext.Provider value={learnNotebooks}>
      <LearnControlManagementContext.Provider
        value={{
          sidebarExpanded,
          flashcardForm,
          practiceTaskForm,
          toggleFlashcardForm,
          togglePracticeTaskForm,
          toggleSidebar,
        }}
      >
        {Sidebar}
        <Flex alignItems="flex-start" ps={{ base: 0, sm: 0, md: 0 }}>
          <Box
            ps={sidebarExpanded ? "17rem" : "4rem"}
            pe={flashcardForm.open || practiceTaskForm.open ? "40vw" : 0}
            w="full"
            transition="padding 0.3s ease-in-out"
          >
            <Header
              withLogo={false}
              knowledgeItemsCount={knowledgeItemsCount}
            />
            <Box pt="3em">{children}</Box>
          </Box>
        </Flex>
        {flashcardForm.open && <FlashcardForm learnId={learnId} />}
        {practiceTaskForm.open && <PracticeTaskForm learnId={learnId} />}
      </LearnControlManagementContext.Provider>
    </LearnNotebooksContext.Provider>
  );
}
