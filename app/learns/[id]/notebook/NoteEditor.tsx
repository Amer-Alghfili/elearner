"use client";

import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/editor/ElearnerNoteEditor";
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
    document.addEventListener("keydown", (e) => {
      const { activeElement } = document;
      if (e.key === "Enter" && activeElement === titleRef.current) {
        editor.focus();
      }
    });
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
