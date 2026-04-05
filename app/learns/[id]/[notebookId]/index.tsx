"use client";

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
import {
  useLearnControlManagement,
  useLearnNotebooksContext,
} from "../LearnPageContainer";

export type NotebookType = {
  id: number;
  title: string;
  blocks?: any[];
  learnId: number;
};
export function Notebook({ notebook }: { notebook: NotebookType }) {
  const { id, blocks = [] } = notebook;

  const [title, setTitle] = React.useState<string>(notebook.title);

  const { toggleFlashcardForm, togglePracticeTaskForm } =
    useLearnControlManagement();

  const { updateNotebookTitle, updateNotebookContent } =
    useLearnNotebooksContext();

  const editor = useElearnerCreateBlockNote({
    initialContent:
      blocks.length === 0
        ? null
        : (blocks.map((block: any) => block.data) as any[]),
  });

  const titleRef = React.useRef<HTMLInputElement>(null);

  const [documentState, setDocumentState] = React.useState<Block<any>[]>();
  const hasEditedDocument = React.useRef(false);

  const [documentBlocks] = useDebounce(documentState, 300);

  React.useEffect(() => {
    return editor.onChange((e: any) => {
      setDocumentState(e.document);
    });
  }, [editor]);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    updateNotebookTitle(id, newTitle);
  }

  const updateContent = React.useEffectEvent((documentBlocks: any) => {
    if (!hasEditedDocument.current) {
      hasEditedDocument.current = true;
      return;
    }

    updateNotebookContent(
      id,
      ((documentBlocks as []) || []).map((block: any, order) => ({
        id: block.id,
        type: block.type,
        data: block,
        file_id: id,
        order,
      })),
    );
  });
  React.useEffect(() => {
    updateContent(documentBlocks);
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
        const currentBlock = editor.getTextCursorPosition();

        const isFirstBlock =
          currentBlock.prevBlock == null && currentBlock.parentBlock == null;
        if (isFirstBlock && e.key === "ArrowUp" && titleRef.current) {
          const selection = window.getSelection();
          let isOnFirstLine = true;

          if (selection && selection.rangeCount > 0) {
            const cursorRange = selection.getRangeAt(0).cloneRange();
            cursorRange.collapse(true);
            const cursorRect = cursorRange.getBoundingClientRect();

            const editorEl =
              document.activeElement?.closest("[contenteditable]");
            if (editorEl) {
              const walker = document.createTreeWalker(
                editorEl,
                NodeFilter.SHOW_TEXT,
              );
              const firstTextNode = walker.nextNode();
              if (firstTextNode) {
                const firstRange = document.createRange();
                firstRange.setStart(firstTextNode, 0);
                firstRange.collapse(true);
                const firstLineRect = firstRange.getBoundingClientRect();
                isOnFirstLine = cursorRect.top < firstLineRect.bottom;
              }
            }
          }

          if (isOnFirstLine) {
            e.preventDefault();
            titleRef.current.setSelectionRange(title.length, title.length);
            titleRef.current.focus();
          }
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
            onChange={({ target }) => handleTitleChange(target.value)}
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
            onClick={() => toggleFlashcardForm({})}
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
            onClick={() => togglePracticeTaskForm({})}
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
