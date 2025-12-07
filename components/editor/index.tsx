"use client";

import React from "react";
import { BlockNoteEditor } from "./BlockNoteEditor";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Files } from "./Files";
import { File } from "@/app/learns/[id]/notes/page";
import { Field } from "../ui/field";

export function Editor({ files, learnId }: { files: File[]; learnId: number }) {
  const [activeFile, setActiveFile] = React.useState<File | null>(
    files.length > 0 ? files[files.length - 1] : null
  );

  React.useEffect(
    function switchToLastFile() {
      setActiveFile(files.length > 0 ? files[files.length - 1] : null);
    },
    [files.length]
  );

  return (
    <Flex>
      <Files
        flex="25%"
        learnId={learnId}
        files={files}
        activeFile={activeFile?.id as number}
        viewContent={setActiveFile}
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
                />
              </Field>
            </Flex>
            <BlockNoteEditor
              key={activeFile.id}
              initialContent={
                activeFile.blocks?.length === 0 ? null : activeFile.blocks
              }
            />
          </Stack>
        )}
      </Box>
    </Flex>
  );
}
