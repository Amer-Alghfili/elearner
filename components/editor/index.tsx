"use client";

import React from "react";
import { BlockNoteEditor } from "./BlockNoteEditor";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Files } from "./Files";
import { File } from "@/app/learns/[id]/notes/page";
import { Field } from "../ui/field";

export function Editor(props: { files: Record<number, File> }) {
  const [files, setFiles] = React.useState<Record<number, File>>(
    Object.keys(props.files).length > 0
      ? props.files
      : {
          1: { title: "Vim", emoji: "🐧", id: 1 },
          2: { title: "User Permissions", id: 2 },
        }
  );

  const [activeFile, setActiveFile] = React.useState<number | null>(
    Object.keys(files).length ? files[Number(Object.keys(files)[0])].id : null
  );

  function createFile() {}

  function updateFile(file: Omit<File, "blocks">) {}

  function deleteFile(id: number) {}

  function updateContent(id: number, blocks: any) {}

  function viewFileContent(id: number) {
    setActiveFile(id);
  }

  return (
    <Flex>
      <Files
        flex="25%"
        files={Object.values(files).map((file) => ({
          ...file,
          active: file.id === activeFile,
        }))}
        viewContent={viewFileContent}
      />
      <Box flex="75%">
        {activeFile && (
          <Stack>
            <Flex ps="3.375rem" alignItems="center" gap="1em">
              {/* TODO: emoji picker */}
              {files[activeFile].emoji != null && (
                <Box textStyle="h3">{files[activeFile].emoji}</Box>
              )}
              <Field>
                <Input
                  variant="plain"
                  textStyle="h3"
                  placeholder="Title"
                  fontWeight="bold"
                  value={files[activeFile].title}
                />
              </Field>
            </Flex>
            <BlockNoteEditor
              key={activeFile}
              initialContent={files[activeFile].blocks}
            />
          </Stack>
        )}
      </Box>
    </Flex>
  );
}
