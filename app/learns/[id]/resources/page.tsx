"use client";

import AddButton from "@/components/button/add";
import {
  Box,
  Button,
  Collapsible,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useLearn } from "../learn-context";
import { Prisma } from "@/generated/prisma/client";
import { Field } from "@/components/ui/field";

export default function ResourcesTabPage() {
  const ctx = useLearn();

  const [resources, setResources] = React.useState<Prisma.ResourceModel[]>(
    ctx.resources || []
  );

  function draft() {
    setResources([
      ...resources,
      {
        // TODO: use uuid
        id: 1,
        title: "",
        description: "",
        file: null,
        link: null,
        tags: null,
        learn_id: ctx.id,
      },
    ]);
  }

  function confirm(index: number, resource: Prisma.ResourceModel) {
    const copy = [...resources];

    copy[index] = resource;

    setResources(copy);
  }

  function cancel(index: number) {
    const copy = [...resources.slice(0, index), ...resources.slice(index + 1)];

    setResources(copy);
  }

  console.log(resources);

  return (
    <Stack>
      <AddButton onClick={() => draft()} alignSelf="self-start">
        Add resource
      </AddButton>
      {resources.map((resource, index) => (
        <Resource
          key={resource.id}
          resource={resource}
          onConfirm={(resource) => confirm(index, resource)}
          onCancel={() => cancel(index)}
        />
      ))}
    </Stack>
  );
}

type ResourceProps = {
  resource: Prisma.ResourceModel;
  onConfirm: (resource: Prisma.ResourceModel) => void;
  onCancel: VoidFunction;
};
function Resource({ resource, onConfirm, onCancel }: ResourceProps) {
  const [open, setOpen] = React.useState(true);

  const [title, setTitle] = React.useState(resource.title);

  return (
    <Stack borderWidth="1px" borderColor="stroke" p="1em" borderRadius="8px">
      <Collapsible.Root open={open}>
        <Collapsible.Trigger>
          {open && (
            <Field>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="plain"
                placeholder="Title"
                textStyle="h5"
              />
            </Field>
          )}
          {!open && <Heading as="h5">{title}</Heading>}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Stack gap="3em" pt="1em">
            <Flex gap="2em">
              <Box>Link</Box>
              <Box>File</Box>
            </Flex>
            <Flex gap="1em" alignItems="center" justifyContent="space-between">
              <Box>Tags</Box>
              <Flex gap="1em">
                <Button
                  onClick={() => {
                    onConfirm({ ...resource, title });
                    setOpen(false);
                  }}
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    onCancel();
                    setOpen(false);
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
}
