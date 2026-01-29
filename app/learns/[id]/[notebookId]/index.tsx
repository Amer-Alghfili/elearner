"use client";

import { useRouter } from "next/navigation";
import { updateFileBlocks, updateFileTitle } from "./actions";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
import React from "react";
import { Block } from "@blocknote/core";
import { useDebounce } from "use-debounce";
import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PlusIcon } from "@/components/Icons";

export type NotebookType = {
  id: number;
  title: string;
  blocks?: any[];
};
export function Notebook({ notebook }: { notebook: NotebookType }) {
  const { id, title, blocks = [] } = notebook;

  const router = useRouter();

  function changeTitle(value: string) {
    updateFileTitle(id, value);

    router.refresh();
  }

  const editor = useElearnerCreateBlockNote({
    initialContent:
      blocks.length === 0
        ? null
        : (blocks.map((block: any) => block.data) as any[]),
  });

  const titleRef = React.useRef<HTMLInputElement>(null);

  const [documentState, setDocumentState] = React.useState<Block<any>[]>();

  const [titleValue] = useDebounce(title, 300);
  const [documentBlocks] = useDebounce(documentState, 300);

  editor.onChange((e: any) => {
    setDocumentState(e.document);
  });

  React.useEffect(() => {
    async function syncTitleWithBackend() {
      await updateFileTitle(id, titleValue as string);
    }

    syncTitleWithBackend();
  }, [titleValue]);

  React.useEffect(() => {
    async function syncDocWithBackend() {
      await updateFileBlocks(
        id,
        ((documentBlocks as []) || []).map((block: any, order) => ({
          id: block.id,
          type: block.type,
          data: block,
          file_id: id,
          order,
        }))
      );
    }

    syncDocWithBackend();
  }, [documentBlocks]);

  React.useEffect(function registerOnEnterClick() {
    function handleArrowNavigation(e: KeyboardEvent) {
      const { activeElement } = document;

      // From title => editor
      if (activeElement === titleRef.current) {
        if (e.key === "ArrowDown") e.preventDefault();

        if (e.key === "ArrowDown" || e.key === "Enter") {
          editor.focus();
        }
      } else {
        // From editor => title
        const isFirstBlock = editor.getTextCursorPosition().prevBlock == null;
        if (isFirstBlock && e.key === "ArrowUp" && titleRef.current) {
          e.preventDefault();
          titleRef.current.setSelectionRange(title.length, title.length);
          titleRef.current.focus();
        }
      }
    }

    document.addEventListener("keydown", handleArrowNavigation);

    return () => document.removeEventListener("keydown", handleArrowNavigation);
  }, []);

  return (
    <Stack>
      <Stack ps="3.375rem" gap="1em">
        <Field>
          <Input
            ref={titleRef}
            variant="plain"
            textStyle="h2"
            placeholder="Title"
            fontWeight="bold"
            value={title}
            onChange={({ target }) => changeTitle(target.value)}
          />
        </Field>
        <Flex
          gap="0.3em"
          borderWidth="1px"
          borderColor="stroke"
          borderRadius="4px"
          px="0.3em"
          py="0.3em"
        >
          <Button
            bg="#dededb"
            borderColor="stroke.thick"
            color="text.secondary"
            borderRadius="3px"
            size="xs"
            fontWeight="bold"
            _hover={{ bg: "neutral.surface" }}
          >
            <PlusIcon fill="text.secondary" strokeWidth="0.3" />
            Flashcard
          </Button>
          <Button
            bg="#dededb"
            borderColor="stroke.thick"
            color="text.secondary"
            borderRadius="3px"
            size="xs"
            fontWeight="bold"
            _hover={{ bg: "neutral.surface" }}
          >
            <PlusIcon fill="text.secondary" strokeWidth="0.3" />
            Practice Task
          </Button>
        </Flex>
      </Stack>
      <ElearnerNoteEditor editor={editor} />
    </Stack>
  );
}
