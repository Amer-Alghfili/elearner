"use client";

import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import Header from "@/components/Header";
import { FlashcardForm } from "./_flashcard-form";
import { Flashcard } from "./knowledge-test/_flash-cards/types";

type FlashcardFormType = { flashcard?: Flashcard; open: boolean };
const LearnControlManagementContext = React.createContext<{
  sidebarExpanded: boolean;
  flashcardForm: FlashcardFormType;
  toggleFlashcardForm: ({ flashcard }: { flashcard?: Flashcard }) => void;
  toggleSidebar: VoidFunction;
}>({
  sidebarExpanded: true,
  flashcardForm: { open: false },
  toggleFlashcardForm: () => {},
  toggleSidebar: () => {},
});

export function useLearnControlManagement() {
  return React.useContext(LearnControlManagementContext);
}

export function LearnPageContainer({
  learnId,
  Sidebar,
  children,
}: {
  learnId: number;
  Sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [flashcardForm, setFlashcardForm] = React.useState<FlashcardFormType>({
    open: false,
  });

  const sidebarAlreadyCollapsed = React.useRef<boolean>(false);

  function expandSidebar() {
    setSidebarExpanded(true);
    setFlashcardForm({ open: false });
    sidebarAlreadyCollapsed.current = false;
  }

  function collapseSidebar() {
    setSidebarExpanded(false);
    sidebarAlreadyCollapsed.current = true;
  }

  function openFlashcardForm({ flashcard }: { flashcard?: Flashcard } = {}) {
    setSidebarExpanded(false);

    const obj: FlashcardFormType = { open: true };
    if (flashcard) {
      obj.flashcard = { ...flashcard };
    }

    setFlashcardForm(obj);
  }

  function closeFlashcardForm() {
    setFlashcardForm({ open: false });
    // expand sidebar if it was not already collapsed by the user
    if (!sidebarAlreadyCollapsed.current) {
      setSidebarExpanded(true);
    }
  }

  function toggleFlashcardForm({ flashcard }: { flashcard?: Flashcard } = {}) {
    if (flashcardForm.open) closeFlashcardForm();
    else openFlashcardForm({ flashcard });
  }

  function toggleSidebar() {
    if (sidebarExpanded) collapseSidebar();
    else expandSidebar();
  }

  return (
    <LearnControlManagementContext.Provider
      value={{
        sidebarExpanded,
        flashcardForm,
        toggleFlashcardForm,
        toggleSidebar,
      }}
    >
      {Sidebar}
      <Flex alignItems="flex-start" ps={{ base: 0, sm: 0, md: 0 }}>
        <Box
          ps={sidebarExpanded ? "17rem" : "4rem"}
          // TODO: Add practice task check
          pe={flashcardForm.open ? "40vw" : 0}
          w="full"
          transition="padding 0.3s ease-in-out"
        >
          <Header withLogo={false} />
          <Box pt="3em">{children}</Box>
        </Box>
      </Flex>
      <FlashcardForm learnId={learnId} />
    </LearnControlManagementContext.Provider>
  );
}
