"use client";

import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { NoteEditor } from "./NoteEditor";
import { useRouter } from "next/navigation";

export type NotebookType = {
  id: number;
  title: string;
  blocks?: any[];
};
export function Notebook(
  props: { notebook: NotebookType; learnId: number } & FlexProps
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { learnId, notebook, ...rest } = props;

  const router = useRouter();

  React.useEffect(
    function refetchFilesBlocksOnSwitch() {
      router.refresh();
    },
    [notebook]
  );

  function changeTitle(value: string) {
    // const copy = [...files];
    // const index = copy.findIndex(({ id }) => id === activeFileId);
    // if (index > -1) {
    //   copy[index].title = value;
    //   setFiles(copy);
    // }
  }

  return (
    <Flex alignItems="flex-start" {...rest}>
      {notebook && (
        <NoteEditor
          key={notebook.id}
          fileId={notebook.id}
          title={notebook.title}
          blocks={notebook.blocks}
          changeFileTitle={changeTitle}
        />
      )}
    </Flex>
  );
}
