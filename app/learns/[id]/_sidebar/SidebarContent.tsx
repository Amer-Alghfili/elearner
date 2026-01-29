"use client";

import { Logo } from "@/components/Logo";
import {
  Collapsible,
  Flex,
  IconButton,
  Stack,
  Link,
  IconProps,
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
import { NotebookType } from "../[notebookId]";
import React from "react";

export function SidebarContent({ notebooks }: { notebooks: NotebookType[] }) {
  const [open, setOpen] = React.useState(true);

  const width = open ? "20rem" : "4rem";

  return (
    <Stack
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w={width}
      px={open ? "1.5em" : 0}
      pt="2em"
      gap="2em"
      borderWidth="1px"
      borderColor="stroke"
      bg="neutral.surface"
    >
      <Flex
        gap="1em"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={open ? "row" : "column"}
      >
        <Logo short={!open} />
        <IconButton
          h="auto"
          border="none"
          variant="plain"
          onClick={() => setOpen((prev) => !prev)}
        >
          <BurgerIcon />
        </IconButton>
      </Flex>
      <Stack gap="1.5em">
        <SidebarLinksGroup
          icon={<NotebookIcon />}
          subLinks={notebooks.map((notebook) => (
            <Link asChild key={notebook.id} textStyle="sm-semibold">
              <NextLink href={notebook.id.toString() as any}>
                {notebook.title}
              </NextLink>
            </Link>
          ))}
        >
          Notebooks
        </SidebarLinksGroup>
        <SidebarLinksGroup icon={<BulbWithFolderIcon />} subLinks={[]}>
          Flashcards
        </SidebarLinksGroup>
        <SidebarLinksGroup icon={<KeyboardIcon />} subLinks={[]}>
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
  children,
}: {
  subLinks: React.ReactNode[];
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  if (!subLinks.length) {
    return <SidebarLink icon={icon}>{children}</SidebarLink>;
  }

  return (
    <Collapsible.Root w="full" textStyle="md-semibold">
      <Collapsible.Trigger
        w="full"
        justifyContent="space-between"
        cursor="pointer"
        display="flex"
        alignItems="center"
        gap="0.5rem"
      >
        <SidebarLink icon={icon}>{children}</SidebarLink>
        <Collapsible.Indicator
          transition="transform 0.2s"
          color="text.secondary"
          _open={{ transform: "rotate(90deg)" }}
        >
          <LuChevronRight />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content mt="0.7em" ms="1rem">
        <Stack>{subLinks}</Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function SidebarLink({
  icon,
  children,
}: {
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  return (
    <Flex
      cursor="pointer"
      color="text.secondary"
      textStyle="md-semibold"
      gap="0.5em"
      alignItems="center"
    >
      {React.cloneElement(icon, {
        stroke: "text.secondary",
      })}
      {children}
    </Flex>
  );
}
