"use client";

import AddButton from "@/components/button/add";
import {
  Box,
  Button,
  Collapsible,
  DialogHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useLearn } from "../learn-context";
import { Prisma } from "@/generated/prisma/client";
import { Field } from "@/components/ui/field";
import { EditIcon } from "@/components/Icons";
import { LuTrash } from "react-icons/lu";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Tags } from "./Tags";
import { postResource } from "./action";

export type ResourceType = Omit<Prisma.ResourceModel, "id" | "tags"> & {
  id: string;
  confirmed: boolean;
  tags: Tag[];
};
export default function ResourcesTabPage() {
  const ctx = useLearn();

  const [resources, setResources] = React.useState<ResourceType[]>(
    (ctx.resources as Prisma.ResourceModel[]).map((resource) => ({
      ...resource,
      id: resource.id.toString(),
      confirmed: true,
      //TODO:
      tags: [],
    }))
  );

  function draft() {
    setResources([
      ...resources,
      {
        // TODO: use uuid
        id: uuidv4(),
        title: "",
        description: "",
        file: null,
        link: null,
        learn_id: ctx.id,
        confirmed: false,
        tags: [],
      },
    ]);
  }

  function confirm(index: number, resource: ResourceType) {
    const copy = [...resources];

    copy[index] = { ...resource, confirmed: true };

    // setResources(copy);
    postResource(resource);
  }

  function remove(index: number) {
    const copy = [...resources];
    copy.splice(index, 1);

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
          onCancel={() => remove(index)}
          onRemove={() => remove(index)}
        />
      ))}
    </Stack>
  );
}

export type Tag = { label: string; color: string };

type ResourceProps = {
  resource: ResourceType;
  onConfirm: (resource: ResourceType) => void;
  onCancel: VoidFunction;
  onRemove: VoidFunction;
};
function Resource({ resource, onConfirm, onCancel, onRemove }: ResourceProps) {
  const [open, setOpen] = React.useState(true);

  const [title, setTitle] = React.useState(resource.title);
  const [tags, setTags] = React.useState<Tag[]>([]);

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
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <IconButton variant="plain" p={0}>
                        <Icon color="accent.softCoral">
                          <LuTrash />
                        </Icon>
                      </IconButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <Heading as="h4" lineHeight="1.6">
                          Are you sure you want to delete {title} ?
                        </Heading>
                      </DialogHeader>
                      <DialogBody textStyle="md">
                        Are you sure you want to delete this resource ? This
                        action cannot be undone
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button variant="secondary">Cancel</Button>
                        </DialogActionTrigger>
                        <Button bg="feedback.error" onClick={() => onRemove()}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
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
              <Tags onTagsChange={setTags} />
              <Flex gap="1em">
                <Button
                  onClick={() => {
                    onConfirm({ ...resource, title, tags });
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
