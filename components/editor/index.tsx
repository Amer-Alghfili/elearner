"use client";

import React from "react";
import { NoteEditor, useElearnerCreateBlockNote } from "./BlockNoteEditor";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Files } from "./Files";
import { File } from "@/app/learns/[id]/notes/page";
import { Field } from "../ui/field";
import { Block } from "@blocknote/core";
import { useDebounce } from "use-debounce";
import { updateFileTitle } from "./actions";

export function Editor({
  files: initialFiles,
  learnId,
}: {
  files: File[];
  learnId: number;
}) {
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

  const editor = useElearnerCreateBlockNote({
    initialContent:
      activeFile == null || activeFile.blocks?.length === 0
        ? null
        : (activeFile.blocks as any[]),
  });

  const [documentState, setDocumentState] = React.useState<Block<any>[]>();

  const [title] = useDebounce(activeFile?.title, 300);
  const [document] = useDebounce(documentState, 300);

  editor.onChange((e: any) => {
    setDocumentState(e.document);
  });

  React.useEffect(
    function syncDocWithBackend() {
      if (activeFile == null) return;

      updateFileTitle(activeFile.id, title as string);
    },
    [title]
  );

  React.useEffect(
    function syncDocWithBackend() {
      //TODO: save changes to db
      console.log(title, document);
    },
    [document]
  );

  return (
    <Flex>
      <Files
        flex="25%"
        learnId={learnId}
        files={files}
        activeFile={activeFile?.id as number}
        viewContent={({ id }) => setActiveFileId(id)}
      />
      <Box flex="75%">
        {activeFile && (
          <Stack>
            <Flex ps="3.375rem" alignItems="center" gap="1em">
              {/* TODO: emoji picker */}
              {activeFile.emoji != null && (
                <Box textStyle="h3">{activeFile.emoji}</Box>
              )}
              <Field>
                <Input
                  variant="plain"
                  textStyle="h3"
                  placeholder="Title"
                  fontWeight="bold"
                  value={activeFile.title}
                  onChange={({ target }) => changeFileTitle(target.value)}
                />
              </Field>
            </Flex>
            <NoteEditor key={activeFile.id} editor={editor} />
          </Stack>
        )}
      </Box>
    </Flex>
  );
}
