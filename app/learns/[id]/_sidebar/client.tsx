"use client";

import { Logo } from "@/components/Logo";
import {
  Collapsible,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  Heading,
  IconButton,
  Stack,
  Link,
  IconProps,
  LinkBox,
  LinkOverlay,
  Box,
  BoxProps,
  Text,
  Button,
} from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import {
  BulbWithFolderIcon,
  BurgerIcon,
  KeyboardIcon,
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
import {
  useLearnControlManagement,
  useLearnNotebooksContext,
} from "../LearnPageContainer";
import { Flashcard } from "../_flashcard-form/types";
import { Remove as RemoveFlashcard } from "../_flashcard-form/Remove";
import TruncateText from "@/components/TruncateText";
import { PracticeTask } from "../_practice-task-form/types";
import { RemovePracticeTask } from "../_practice-task-form/Remove";
import { CreateNotebook } from "../_notebook/Create";
import { RemoveNotebook } from "../_notebook/Remove";
import { Resource, Resources } from "./resources";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { FaPlay } from "react-icons/fa";

export function Sidebar({
  learnId,
  flashcards,
  practiceTasks,
  resources,
  atNotebookLimit,
}: {
  learnId: number;
  flashcards: Flashcard[];
  practiceTasks: PracticeTask[];
  resources: Resource[];
  atNotebookLimit: boolean;
}) {
  const {
    sidebarExpanded,
    toggleSidebar,
    toggleFlashcardForm,
    togglePracticeTaskForm,
  } = useLearnControlManagement();

  const { notebooks } = useLearnNotebooksContext();

  return (
    <Stack
      display={{ base: "none", md: "flex" }}
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w={sidebarExpanded ? "20rem" : "4rem"}
      px={sidebarExpanded ? "1.5em" : 0}
      py="2em"
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
          action={
            <CreateNotebook learnId={learnId} atNotebookLimit={atNotebookLimit} />
          }
          subLinks={notebooks.map((notebook) => (
            <SidebarLink
              key={notebook.id}
              href={notebook.id.toString()}
              prefetch={false}
              action={<RemoveNotebook id={notebook.id} learnId={learnId} />}
            >
              <SidebarLinkContent>{notebook.title}</SidebarLinkContent>
            </SidebarLink>
          ))}
        >
          Notebooks
        </SidebarLinksGroup>
        <SidebarLinksGroup
          icon={<BulbWithFolderIcon />}
          subLinks={flashcards.map((flashcard) => (
            <SidebarLink
              key={flashcard.id}
              action={<RemoveFlashcard id={flashcard.id} />}
            >
              <LinkOverlay onClick={() => toggleFlashcardForm({ flashcard })}>
                <SidebarLinkContent>{flashcard.question}</SidebarLinkContent>
              </LinkOverlay>
            </SidebarLink>
          ))}
        >
          Flashcards
        </SidebarLinksGroup>
        <SidebarLinksGroup
          icon={<KeyboardIcon />}
          subLinks={practiceTasks.map((practiceTask) => (
            <SidebarLink
              key={practiceTask.id}
              action={<RemovePracticeTask id={practiceTask.id} />}
            >
              <LinkOverlay
                onClick={() => togglePracticeTaskForm({ practiceTask })}
              >
                <SidebarLinkContent>{practiceTask.title}</SidebarLinkContent>
              </LinkOverlay>
            </SidebarLink>
          ))}
        >
          Practice Tasks
        </SidebarLinksGroup>
        <Resources resources={resources} learnId={learnId} />
      </Stack>
      {sidebarExpanded && <LearnVideoGuide />}
    </Stack>
  );
}

function LearnVideoGuide() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Stack
        w="full"
        mt="auto"
        gap="0.75em"
        px="1.25em"
        py="1.25em"
        borderRadius="12px"
        bg="linear-gradient(135deg, #FFFEF7 0%, #FEFCE8 60%, #FEFADC 100%)"
        border="1px solid"
        borderColor="rgba(234, 210, 100, 0.35)"
        color="text.primary"
      >
        <Heading as="h4" fontSize="sm" fontWeight="bold" color="text.primary">
          How to use this page ?
        </Heading>
        <Text fontSize="xs" color="text.secondary">
          Watch this short video to get the most out of the learn page.
        </Text>
        <Button
          variant="plain"
          color="primary"
          mt="0.5em"
          alignSelf="flex-start"
          p={0}
          h="auto"
          fontSize="sm"
          onClick={() => setOpen(true)}
        >
          Watch video <FaPlay color="#986D00" />
        </Button>
      </Stack>

      <DialogRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="xl"
        placement="center"
      >
        <DialogContent borderRadius="12px">
          <DialogBody p="0">
            <iframe
              width="100%"
              style={{ aspectRatio: "16/9", borderRadius: "12px" }}
              src={
                open
                  ? "https://www.youtube.com/embed/c-LtuKI9ti8?autoplay=1"
                  : undefined
              }
              title="YouTube video"
              allowFullScreen
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

export function SidebarLinksGroup({
  subLinks,
  icon,
  action,
  showArrows = true,
  children,
}: {
  subLinks: React.ReactNode[];
  icon?: React.ReactElement<IconProps>;
  action?: React.ReactNode;
  showArrows?: boolean;
  children: React.ReactNode;
}) {
  const { sidebarExpanded } = useLearnControlManagement();

  if (sidebarExpanded) {
    return (
      <Collapsible.Root
        w={sidebarExpanded ? "full" : "auto"}
        textStyle="md-semibold"
      >
        <Collapsible.Trigger asChild w="full" cursor="pointer">
          <Flex justifyContent="space-between" alignItems="center" gap="0.5rem">
            <SidebarItem icon={icon}>{children}</SidebarItem>
            {sidebarExpanded && showArrows && (
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
          </Flex>
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
        <SidebarItem icon={icon}>{children}</SidebarItem>
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

function SidebarItem({
  icon,
  children,
}: {
  icon?: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  const { sidebarExpanded } = useLearnControlManagement();

  let mappedIcon;
  if (icon) {
    mappedIcon = React.cloneElement(icon, {
      stroke: "text.secondary",
    });

    if (!sidebarExpanded) return mappedIcon;
  }

  return (
    <Flex
      cursor="pointer"
      color="text.secondary"
      textStyle="md-semibold"
      gap="0.5em"
      alignItems="center"
      w="full"
    >
      {mappedIcon}
      {children}
    </Flex>
  );
}

export function SidebarLinkContent({
  icon,
  ...props
}: { icon?: React.ReactNode } & BoxProps) {
  const { children } = props;

  if (icon == null) return <TruncateText {...props}>{children}</TruncateText>;

  return (
    <Box display="flex" alignItems="center" gap="0.5em" w="full" {...props}>
      {icon}
      <TruncateText>{children}</TruncateText>
    </Box>
  );
}
export function LearnMobileDrawer({
  learnId,
  flashcards,
  practiceTasks,
  resources,
  atNotebookLimit,
}: {
  learnId: number;
  flashcards: Flashcard[];
  practiceTasks: PracticeTask[];
  resources: Resource[];
  atNotebookLimit: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const { toggleFlashcardForm, togglePracticeTaskForm } =
    useLearnControlManagement();
  const { notebooks } = useLearnNotebooksContext();

  return (
    <>
      <Flex
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="1.8em"
        left="1em"
        zIndex="overlay"
        gap="0.25em"
      >
        <IconButton
          h="auto"
          border="none"
          variant="plain"
          onClick={() => setOpen(true)}
        >
          <BurgerIcon />
        </IconButton>
      </Flex>

      <DrawerRoot
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        placement="start"
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent bg="neutral.surface" maxW="20rem">
            <DrawerHeader>
              <DrawerCloseTrigger />
            </DrawerHeader>
            <DrawerBody>
              <Stack alignItems="flex-start" gap="1.5em">
                <SidebarLinksGroup
                  icon={<NotebookIcon />}
                  action={
                    <CreateNotebook
                      learnId={learnId}
                      atNotebookLimit={atNotebookLimit}
                    />
                  }
                  subLinks={notebooks.map((notebook) => (
                    <SidebarLink
                      key={notebook.id}
                      href={notebook.id.toString()}
                      prefetch={false}
                      action={
                        <RemoveNotebook id={notebook.id} learnId={learnId} />
                      }
                    >
                      <SidebarLinkContent>{notebook.title}</SidebarLinkContent>
                    </SidebarLink>
                  ))}
                >
                  Notebooks
                </SidebarLinksGroup>
                <SidebarLinksGroup
                  icon={<BulbWithFolderIcon />}
                  subLinks={flashcards.map((flashcard) => (
                    <SidebarLink
                      key={flashcard.id}
                      action={<RemoveFlashcard id={flashcard.id} />}
                    >
                      <LinkOverlay
                        onClick={() => {
                          toggleFlashcardForm({ flashcard });
                          setOpen(false);
                        }}
                      >
                        <SidebarLinkContent>
                          {flashcard.question}
                        </SidebarLinkContent>
                      </LinkOverlay>
                    </SidebarLink>
                  ))}
                >
                  Flashcards
                </SidebarLinksGroup>
                <SidebarLinksGroup
                  icon={<KeyboardIcon />}
                  subLinks={practiceTasks.map((practiceTask) => (
                    <SidebarLink
                      key={practiceTask.id}
                      action={<RemovePracticeTask id={practiceTask.id} />}
                    >
                      <LinkOverlay
                        onClick={() => {
                          togglePracticeTaskForm({ practiceTask });
                          setOpen(false);
                        }}
                      >
                        <SidebarLinkContent>
                          {practiceTask.title}
                        </SidebarLinkContent>
                      </LinkOverlay>
                    </SidebarLink>
                  ))}
                >
                  Practice Tasks
                </SidebarLinksGroup>
                <Resources resources={resources} learnId={learnId} />
                <LearnVideoGuide />
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  );
}

export function SidebarLink({
  action,
  href,
  prefetch,
  children,
  linkProps,
  ...props
}: {
  action?: React.ReactNode;
  href?: string;
  prefetch?: boolean;
  children: React.ReactNode;
  linkProps?: Omit<LinkProps<string>, "href">;
} & BoxProps) {
  const pathname = usePathname();

  const isActive =
    href != null && href !== "" && pathname.endsWith(href as string);

  if (action != null) {
    return (
      <Box {...props}>
        <LinkBox w="full">
          <Flex
            justifyContent="space-between"
            alignItems="center"
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
          >
            <LinkOverlay asChild w="80%">
              {href != null && (
                <NextLink href={href as any} prefetch={prefetch}>
                  {children}
                </NextLink>
              )}
              {href == null && children}
            </LinkOverlay>
            {action}
          </Flex>
        </LinkBox>
      </Box>
    );
  }

  return (
    <Box
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
      cursor="pointer"
      {...props}
    >
      {href != null && (
        <Link asChild w="full" textDecoration="none">
          <NextLink href={href as any} target="_blank" {...linkProps}>
            {children}
          </NextLink>
        </Link>
      )}
      {href == null && children}
    </Box>
  );
}
