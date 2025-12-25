"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { Files } from "./Files";
import { NoteEditor } from "./NoteEditor";
import { useRouter } from "next/navigation";
import { File } from "./page";

export function NoteEditorContainer({
  files: initialFiles,
  learnId,
}: {
  files: File[];
  learnId: number;
}) {
  const router = useRouter();

  const [files, setFiles] = React.useState<File[]>(initialFiles);
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
      setFiles(initialFiles);
    },
    [initialFiles]
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

  //TODO: empty state
  return (
    <Flex alignItems="flex-start">
      <Files
        flex="40%"
        minH="55vh"
        maxW="20em"
        overflow="auto"
        learnId={learnId}
        files={files}
        activeFile={activeFile?.id as number}
        viewContent={({ id }) => setActiveFileId(id)}
      />
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
