"use client";

import { useRouter } from "next/navigation";
import { updateFileTitle } from "./actions";
import { NoteEditor } from "./NoteEditor";

export type NotebookType = {
  id: number;
  title: string;
  blocks?: any[];
};
export function Notebook(props: { notebook: NotebookType }) {
  const { notebook } = props;

  const router = useRouter();

  function changeTitle(value: string) {
    updateFileTitle(notebook.id, value);

    router.refresh();
  }

  return (
    <NoteEditor
      key={notebook.id}
      fileId={notebook.id}
      title={notebook.title}
      blocks={notebook.blocks}
      changeFileTitle={changeTitle}
    />
  );
}
