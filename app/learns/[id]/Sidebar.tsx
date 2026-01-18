"use client";

import { Logo } from "@/components/Logo";
import {
  Collapsible,
  CollapsibleRootProps,
  Flex,
  IconButton,
  Stack,
  Link,
} from "@chakra-ui/react";
import { NotebookType } from "./[notebookId]";
import NextLink from "next/link";
import { BurgerIcon } from "@/components/Icons";
import { LuChevronRight } from "react-icons/lu";

export function Sidebar({ notebooks }: { notebooks: NotebookType[] }) {
  return (
    <Stack
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w="25rem"
      ps="2em"
      pt="2em"
      gap="2em"
      border="1px solid black"
    >
      <Flex gap="1em" alignItems="center">
        <Logo />
        <IconButton variant="plain">
          <BurgerIcon />
        </IconButton>
      </Flex>
      <Stack gap="1.5em">
        <LinksGroup
          content={notebooks.map((notebook) => (
            <Link
              key={notebook.id}
              href={notebook.id.toString() as any}
              textStyle="sm-semibold"
            >
              {notebook.title}
            </Link>
          ))}
        >
          Notebooks
        </LinksGroup>
        <LinksGroup content={[]}>Flashcards</LinksGroup>
        <LinksGroup content={[]}>Practice Tasks</LinksGroup>
        <LinksGroup content={[]}>Resources</LinksGroup>
        {/* <Link asChild textStyle="md-semibold">
          <NextLink href="#">Settings</NextLink>
        </Link> */}
      </Stack>
    </Stack>
  );
}

function LinksGroup({
  content,
  children,
  ...props
}: {
  content: React.ReactNode[];
  children: React.ReactNode;
} & CollapsibleRootProps) {
  return (
    <Collapsible.Root textStyle="md-semibold" {...props}>
      <Collapsible.Trigger
        cursor="pointer"
        display="flex"
        alignItems="center"
        gap="0.5rem"
      >
        {children}
        <Collapsible.Indicator
          transition="transform 0.2s"
          _open={{ transform: "rotate(90deg)" }}
        >
          <LuChevronRight />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content mt="0.7em" ms="1rem">
        <Stack>{content}</Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
