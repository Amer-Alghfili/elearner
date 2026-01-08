"use client";

import { Logo } from "@/components/Logo";
import {
  Box,
  Collapsible,
  CollapsibleRootProps,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { NotebookType } from "./[notebookId]";
import Link from "next/link";

export function Sidebar({ notebooks }: { notebooks: NotebookType[] }) {
  return (
    <Stack>
      <Flex>
        <Logo />
        <Box>burger icon</Box>
      </Flex>
      <LinksGroup
        content={notebooks.map((notebook) => (
          <Link key={notebook.id} href={notebook.id.toString() as any}>
            {notebook.title}
          </Link>
        ))}
      >
        Notebooks
      </LinksGroup>
      <LinksGroup
        content={[
          <LinksGroup key="0" content={[]}>
            Flashcards
          </LinksGroup>,
          <LinksGroup key="1" content={[]}>
            Practice Tasks
          </LinksGroup>,
        ]}
      >
        Test Knowledge
      </LinksGroup>
      <LinksGroup content={[]}>Resources</LinksGroup>
      <Link href="#">Settings</Link>
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
    <Collapsible.Root {...props}>
      <Collapsible.Trigger cursor="pointer">{children}</Collapsible.Trigger>
      <Collapsible.Content>
        <Stack>{content}</Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
