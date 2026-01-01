"use client";

import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
import { Block } from "@blocknote/core";
import React from "react";
import { useDebounce } from "use-debounce";
import { updateFileBlocks, updateFileTitle } from "./actions";
import { Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

export function NoteEditor({
  fileId,
  title,
  blocks,
  changeFileTitle,
}: {
  fileId: number;
  title: string;
  blocks: any;
  changeFileTitle: (value: string) => void;
}) {
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
    async function syncDocWithBackend() {
      await updateFileTitle(fileId, titleValue as string);
    }

    syncDocWithBackend();
  }, [titleValue]);

  React.useEffect(() => {
    async function syncDocWithBackend() {
      await updateFileBlocks(
        fileId,
        ((documentBlocks as []) || []).map((block: any, order) => ({
          id: block.id,
          type: block.type,
          data: block,
          file_id: fileId,
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
    <Stack flex="60%">
      <Field ps="3.375rem">
        <Input
          ref={titleRef}
          variant="plain"
          textStyle="h2"
          placeholder="Title"
          fontWeight="bold"
          value={title}
          onChange={({ target }) => changeFileTitle(target.value)}
        />
      </Field>
      <ElearnerNoteEditor editor={editor} />
    </Stack>
  );
}
