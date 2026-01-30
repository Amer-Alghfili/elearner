"use client";

import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import Header from "@/components/Header";

const LearnControlManagementContext = React.createContext<{
  sidebarExpanded: boolean;
  formOpen: boolean;
  toggleForm: VoidFunction;
  toggleSidebar: VoidFunction;
}>({
  sidebarExpanded: true,
  formOpen: false,
  toggleForm: () => {},
  toggleSidebar: () => {},
});

export function useLearnControlManagement() {
  return React.useContext(LearnControlManagementContext);
}

export function LearnPageContainer({
  Sidebar,
  children,
}: {
  Sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);

  const sidebarAlreadyCollapsed = React.useRef<boolean>(false);

  function expandSidebar() {
    setSidebarExpanded(true);
    setFormOpen(false);
    sidebarAlreadyCollapsed.current = false;
    //TODO: reset form state if any
  }

  function collapseSidebar() {
    setSidebarExpanded(false);
    sidebarAlreadyCollapsed.current = true;
  }

  function openForm() {
    setFormOpen(true);
    setSidebarExpanded(false);
  }

  function closeForm() {
    setFormOpen(false);
    // expand sidebar if it was not already collapsed by the user
    if (!sidebarAlreadyCollapsed.current) {
      setSidebarExpanded(true);
    }
    //TODO: reset form state if any
  }

  function toggleForm() {
    if (formOpen) closeForm();
    else openForm();
  }

  function toggleSidebar() {
    if (sidebarExpanded) collapseSidebar();
    else expandSidebar();
  }

  return (
    <LearnControlManagementContext.Provider
      value={{
        sidebarExpanded,
        formOpen,
        toggleForm,
        toggleSidebar,
      }}
    >
      {Sidebar}
      <Flex alignItems="flex-start" ps={{ base: 0, sm: 0, md: 0 }}>
        <Box
          ps={sidebarExpanded ? "17rem" : "4rem"}
          w="full"
          transition="padding 0.3s ease-in-out"
        >
          <Header withLogo={false} />
          <Box pt="3em">{children}</Box>
        </Box>
      </Flex>
      {/* TODO: practice task and flashcard forms */}
    </LearnControlManagementContext.Provider>
  );
}
