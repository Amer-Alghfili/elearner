"use client";

import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { Files } from "./Files";
import { NoteEditor } from "./NoteEditor";
import { useRouter } from "next/navigation";

export type File = {
  id: number;
  title: string;
  blocks?: any[];
};
export function Notebook(
  props: { files: File[]; learnId: number } & FlexProps
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { learnId, files: _, ...rest } = props;

  const router = useRouter();

  const [files, setFiles] = React.useState<File[]>(props.files);
  const [activeFileId, setActiveFileId] = React.useState<number | null>(
    files.length > 0 ? files[files.length - 1].id : null
  );

  React.useEffect(
    function switchToLastFile() {
      if (activeFileId != null && files.some(({ id }) => id === activeFileId)) {
        return;
      }

      setActiveFileId(files.length > 0 ? files[files.length - 1].id : null);
    },
    [files.length]
  );

  React.useEffect(
    function syncServerState() {
      setFiles(props.files);
    },
    [props.files]
  );

  React.useEffect(
    function refetchFilesBlocksOnSwitch() {
      router.refresh();
    },
    [activeFileId]
  );

  function changeFileTitle(value: string) {
    const copy = [...files];
    const index = copy.findIndex(({ id }) => id === activeFileId);

    if (index > -1) {
      copy[index].title = value;
      setFiles(copy);
    }
  }

  const activeFile =
    activeFileId == null ? null : files.find(({ id }) => id === activeFileId);

  return (
    <Flex alignItems="flex-start" {...rest}>
      {/* <Files
        flex="40%"
        minH="55vh"
        maxW="20em"
        overflow="auto"
        learnId={learnId}
        files={files}
        activeFile={activeFile?.id as number}
        viewContent={({ id }) => setActiveFileId(id)}
      /> */}
      {activeFile && (
        <NoteEditor
          key={activeFile.id}
          fileId={activeFile.id}
          title={activeFile.title}
          blocks={activeFile.blocks}
          changeFileTitle={changeFileTitle}
        />
      )}
    </Flex>
  );
}
