"use client";

import AddButton from "@/components/button/add";
import {
  Box,
  Button,
  Collapsible,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useLearn } from "../learn-context";
import { Prisma } from "@/generated/prisma/client";
import { Field } from "@/components/ui/field";
import { EditIcon } from "@/components/Icons";
import { LuTrash } from "react-icons/lu";

type Resource = Prisma.ResourceModel & { confirmed: boolean };
export default function ResourcesTabPage() {
  const ctx = useLearn();

  const [resources, setResources] = React.useState<Resource[]>(
    (ctx.resources as Prisma.ResourceModel[]).map((resources) => ({
      ...resources,
      confirmed: true,
    }))
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
        confirmed: false,
      },
    ]);
  }

  function confirm(index: number, resource: Resource) {
    const copy = [...resources];

    copy[index] = { ...resource, confirmed: true };

    setResources(copy);
  }

  function cancel(index: number) {
    const copy = [...resources.slice(0, index), ...resources.slice(index + 1)];

    setResources(copy);
  }

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
  resource: Resource;
  onConfirm: (resource: Resource) => void;
  onCancel: VoidFunction;
};
function Resource({ resource, onConfirm, onCancel }: ResourceProps) {
  const [open, setOpen] = React.useState(true);

  const [title, setTitle] = React.useState(resource.title);

  return (
    <Stack
      borderWidth="1px"
      borderColor="stroke"
      px="1.5em"
      py="1em"
      borderRadius="8px"
    >
      <Collapsible.Root open={open}>
        <Collapsible.Trigger w="full">
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
          {!open && (
            <Flex alignItems="center" gap="1em" justifyContent="space-between">
              <Heading as="h5">{title}</Heading>
              {resource.confirmed && (
                <Flex gap={0}>
                  <IconButton
                    variant="plain"
                    p={0}
                    onClick={() => setOpen(true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton variant="plain" p={0}>
                    <Icon color="accent.softCoral">
                      <LuTrash />
                    </Icon>
                  </IconButton>
                </Flex>
              )}
            </Flex>
          )}
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
                  {resource.confirmed ? "Update" : "Create"}
                </Button>
                <Button
                  onClick={() => {
                    if (!resource.confirmed) onCancel();

                    setTitle(resource.title);
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
