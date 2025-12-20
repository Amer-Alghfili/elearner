"use client";

import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/editor/ElearnerNoteEditor";
import React from "react";
import { useDebounce } from "use-debounce";
import { updateLearnBlocks } from "./actions";

export default function NoteEditor({
  learnId,
  initialContent,
}: {
  learnId: number;
  initialContent: any[];
}) {
  const editor = useElearnerCreateBlockNote({
    initialContent: initialContent.length == 0 ? null : initialContent,
    style: "padding-inline-start: 1em; padding-top: 0",
    placeholder: "Drop ideas, thoughts, todos, etc",
  });

  const [documentState, setDocumentState] = React.useState<any[]>();
  const [document] = useDebounce(documentState, 300);

  editor.onChange((e: any) => {
    setDocumentState(e.document);
  });

  React.useEffect(() => {
    async function syncDocWithBackend() {
      await updateLearnBlocks(
        learnId,
        ((document as []) || []).map((block: any, order) => ({
          id: block.id,
          type: block.type,
          data: block,
          learn_id: learnId,
          order,
        }))
      );
    }

    syncDocWithBackend();
  }, [document]);

  return <ElearnerNoteEditor editor={editor} />;
}
