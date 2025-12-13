"use client";

import React from "react";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "../../../../components/editor/ElearnerNoteEditor";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Files } from "./Files";
import { File } from "@/app/learns/[id]/notes/page";
import { Field } from "../../../../components/ui/field";
import { Block } from "@blocknote/core";
import { useDebounce } from "use-debounce";
import { updateFileBlocks, updateFileTitle } from "./actions";
import { useRouter } from "next/navigation";

export function NoteEditorContainer({
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
            <Field ps="3.375rem">
              <Input
                variant="plain"
                textStyle="h3"
                placeholder="Title"
                fontWeight="bold"
                value={activeFile.title}
                onChange={({ target }) => changeFileTitle(target.value)}
              />
            </Field>
            {activeFile != null && (
              <NoteEditor
                key={activeFile.id}
                fileId={activeFile.id}
                title={activeFile.title}
                blocks={activeFile.blocks}
              />
            )}
          </Stack>
        )}
      </Box>
    </Flex>
  );
}

function NoteEditor({
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
