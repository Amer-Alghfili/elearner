"use client";

import { Logo } from "@/components/Logo";
import {
  Collapsible,
  Flex,
  IconButton,
  Stack,
  Link,
  IconProps,
  LinkProps,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  BulbWithFolderIcon,
  BurgerIcon,
  KeyboardIcon,
  LinkWithFolderIcon,
  NotebookIcon,
} from "@/components/Icons";
import { LuChevronRight } from "react-icons/lu";
import React from "react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { usePathname } from "next/navigation";
import { NotebookType } from "../[notebookId]";
import { useLearnControlManagement } from "../LearnPageContainer";
import { Flashcard } from "../_flashcard-form/types";
import { Remove as RemoveFlashcard } from "../_flashcard-form/Remove";
import TruncateText from "@/components/TruncateText";
import { PracticeTask } from "../_practice-task-form/types";
import { RemovePracticeTask } from "../_practice-task-form/Remove";
import { CreateNotebook } from "../_notebook/Create";
import { RemoveNotebook } from "../_notebook/Remove";

export function Sidebar({
  learnId,
  notebooks,
  flashcards,
  practiceTasks,
}: {
  learnId: number;
  notebooks: Omit<NotebookType, "learnId">[];
  flashcards: Flashcard[];
  practiceTasks: PracticeTask[];
}) {
  const {
    sidebarExpanded,
    toggleSidebar,
    toggleFlashcardForm,
    togglePracticeTaskForm,
  } = useLearnControlManagement();

  return (
    <Stack
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w={sidebarExpanded ? "20rem" : "4rem"}
      px={sidebarExpanded ? "1.5em" : 0}
      pt="2em"
      gap="2em"
      borderWidth="1px"
      borderColor="stroke"
      bg="neutral.surface"
      transition="width 0.3s ease-in-out"
    >
      <Flex
        gap="1em"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={sidebarExpanded ? "row" : "column"}
      >
        <Logo short={!sidebarExpanded} />
        <IconButton
          h="auto"
          border="none"
          variant="plain"
          onClick={toggleSidebar}
        >
          <BurgerIcon />
        </IconButton>
      </Flex>

      <Stack alignItems={sidebarExpanded ? "flex-start" : "center"} gap="1.5em">
        <SidebarLinksGroup
          icon={<NotebookIcon />}
          action={<CreateNotebook learnId={learnId} />}
          subLinks={notebooks.map((notebook) => (
            <LinkBox key={notebook.id} w="full">
              <LinkOverlay>
                <SidebarSubLink
                  href={notebook.id.toString()}
                  display="flex"
                  justifyContent="space-between"
                >
                  {notebook.title}
                  <RemoveNotebook id={notebook.id} />
                </SidebarSubLink>
              </LinkOverlay>
            </LinkBox>
          ))}
        >
          Notebooks
        </SidebarLinksGroup>
        <SidebarLinksGroup
          icon={<BulbWithFolderIcon />}
          subLinks={flashcards.map((flashcard) => (
            <LinkBox key={flashcard.id} w="full">
              <SidebarSubLink
                w="full"
                href=""
                display="flex"
                justifyContent="space-between"
              >
                <TruncateText>
                  <LinkOverlay
                    onClick={() => toggleFlashcardForm({ flashcard })}
                  >
                    {flashcard.question}
                  </LinkOverlay>
                </TruncateText>
                <RemoveFlashcard id={flashcard.id} />
              </SidebarSubLink>
            </LinkBox>
          ))}
        >
          Flashcards
        </SidebarLinksGroup>
        <SidebarLinksGroup
          icon={<KeyboardIcon />}
          subLinks={practiceTasks.map((practiceTask) => (
            <LinkBox key={practiceTask.id} w="full">
              <SidebarSubLink
                w="full"
                href=""
                display="flex"
                justifyContent="space-between"
              >
                <TruncateText>
                  <LinkOverlay
                    onClick={() => togglePracticeTaskForm({ practiceTask })}
                  >
                    {practiceTask.title}
                  </LinkOverlay>
                </TruncateText>
                <RemovePracticeTask id={practiceTask.id} />
              </SidebarSubLink>
            </LinkBox>
          ))}
        >
          Practice Tasks
        </SidebarLinksGroup>
        <SidebarLinksGroup icon={<LinkWithFolderIcon />} subLinks={[]}>
          Resources
        </SidebarLinksGroup>
      </Stack>
    </Stack>
  );
}

function SidebarLinksGroup({
  subLinks,
  icon,
  action,
  children,
}: {
  subLinks: React.ReactNode[];
  icon: React.ReactElement<IconProps>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { sidebarExpanded } = useLearnControlManagement();

  if (!subLinks.length) {
    return <SidebarLink icon={icon}>{children}</SidebarLink>;
  }

  if (sidebarExpanded) {
    return (
      <Collapsible.Root
        w={sidebarExpanded ? "full" : "auto"}
        textStyle="md-semibold"
      >
        <Collapsible.Trigger
          w="full"
          justifyContent="space-between"
          cursor="pointer"
          display="flex"
          alignItems="center"
          gap="0.5rem"
        >
          <SidebarLink icon={icon}>{children}</SidebarLink>
          {sidebarExpanded && (
            <Flex alignItems="center">
              {action != null && action}
              <Collapsible.Indicator
                transition="transform 0.2s"
                color="text.secondary"
                _open={{ transform: "rotate(90deg)" }}
              >
                <LuChevronRight />
              </Collapsible.Indicator>
            </Flex>
          )}
        </Collapsible.Trigger>
        <Collapsible.Content mt="0.7em" ms="1rem">
          <Stack>{subLinks}</Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <MenuRoot>
      <MenuTrigger>
        <SidebarLink icon={icon}>{children}</SidebarLink>
      </MenuTrigger>
      <MenuContent maxW="25em">
        {subLinks.map((subLink, index) => (
          <MenuItem
            key={index}
            value={index.toString()}
            p={0}
            borderRadius="8px"
            _hover={{ bg: "transparent" }}
          >
            {subLink}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

function SidebarLink({
  icon,
  children,
}: {
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  const { sidebarExpanded } = useLearnControlManagement();

  const mappedIcon = React.cloneElement(icon, {
    stroke: "text.secondary",
  });

  if (!sidebarExpanded) return mappedIcon;

  return (
    <Flex
      cursor="pointer"
      color="text.secondary"
      textStyle="md-semibold"
      gap="0.5em"
      alignItems="center"
    >
      {mappedIcon}
      {children}
    </Flex>
  );
}

function SidebarSubLink(props: LinkProps) {
  const pathname = usePathname();

  const isActive = props.href !== "" && pathname.endsWith(props.href as string);

  return (
    <Link
      asChild
      w="full"
      textStyle="sm-semibold"
      textDecoration="none"
      outline="none"
      py="0.3em"
      px="1em"
      borderRadius="8px"
      bg={isActive ? "stroke.transparent" : "transparent"}
      _hover={{
        bg: "stroke.transparent",
      }}
      {...props}
    >
      <NextLink href={props.href as any}>{props.children}</NextLink>
    </Link>
  );
}
