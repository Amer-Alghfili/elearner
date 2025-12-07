"use client";

import React from "react";
import { BlockNoteEditor } from "./BlockNoteEditor";
import { Box, Flex, Input, Stack } from "@chakra-ui/react";
import { Files } from "./Files";
import { File } from "@/app/learns/[id]/notes/page";
import { Field } from "../ui/field";
import { postFile } from "./actions";

export function Editor(props: { files: File[]; learnId: number }) {
  const [formState, action, loading] = React.useActionState(postFile, {
    data: props.files,
    error: null,
  });
  const { data: files, error } = formState;

  const [activeFileId, setActiveFileId] = React.useState(
    (files as File[]).length ? (files as File[])[0].id : null
  );

  function post(file: Omit<File, "blocks">) {}

  // function remove(id: number) {}

  // function updateContent(id: number, blocks: any) {}

  const activeFile = files.find(({ id }) => id === activeFileId) as File;

  return (
    <Flex>
      <Files
        flex="25%"
        files={files as File[]}
        activeFile={activeFileId}
        loading={loading}
        viewContent={(id) => setActiveFileId(id)}
        onCreate={() => {
          React.startTransition(() => {
            const formData = new FormData();
            formData.append("learnId", props.learnId.toString());
            formData.append("title", "");

            action(formData);
          });
        }}
      />
      <Box flex="75%">
        {activeFileId && (
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
              key={activeFileId}
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
