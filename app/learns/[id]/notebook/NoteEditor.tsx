"use client";

import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/editor/ElearnerNoteEditor";
import { Block } from "@blocknote/core";
import React from "react";
import { useDebounce } from "use-debounce";
import { updateFileBlocks, updateFileTitle } from "./actions";

export function NoteEditor({
  fileId,
  title,
  blocks,
}: {
  fileId: number;
  title: string;
  blocks: any;
}) {
  const editor = useElearnerCreateBlockNote({
    initialContent:
      blocks.length === 0
        ? null
        : (blocks.map((block: any) => block.data) as any[]),
  });

  const [documentState, setDocumentState] = React.useState<Block<any>[]>();

  const [titleValue] = useDebounce(title, 300);
  const [document] = useDebounce(documentState, 300);

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
        (document as []).map((block: any, order) => ({
          id: block.id,
          type: block.type,
          data: block,
          file_id: fileId,
          order,
        }))
      );
    }

    syncDocWithBackend();
  }, [document]);

  return <ElearnerNoteEditor editor={editor} />;
}
