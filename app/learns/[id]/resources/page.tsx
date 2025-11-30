"use client";

import AddButton from "@/components/button/add";
import {
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
import { LearnCtx, ResourceType, Tag, useLearn } from "../learn-context";
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
import { toaster } from "@/components/ui/toaster";

export default function ResourcesTabPage() {
  const ctx = useLearn();

  const [resources, setResources] = React.useState<ResourceType[]>(
    ctx.resources
  );
  const [tags, setTags] = React.useState(ctx.allTags);

  function draft() {
    setResources([
      ...resources,
      {
        id: uuidv4(),
        title: "",
        link: "",
        confirmed: false,
        tags: [],
      },
    ]);
  }

  async function confirm(index: number, resource: ResourceType) {
    try {
      const id = await postResource(ctx.id, resource);

      const copy = [...resources];
      copy[index] = {
        ...resource,
        id,
        confirmed: true,
      };
      setResources(copy);
    } catch (err: any) {
      if (err.message != null)
        toaster.create({
          title: err.message,
          type: "error",
          closable: true,
        });

      throw Error(err);
    }
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

type ResourceProps = {
  resource: ResourceType;
  onConfirm: (resource: ResourceType) => Promise<void>;
  onCancel: VoidFunction;
  onRemove: VoidFunction;
};
function Resource({ resource, onConfirm, onCancel, onRemove }: ResourceProps) {
  const [open, setOpen] = React.useState(!resource.confirmed);

  const [loading, setLoading] = React.useState(false);

  const [link, setLink] = React.useState<string>(resource.link);

  const [title, setTitle] = React.useState(resource.title);
  const [tags, setTags] = React.useState<Tag[]>(resource.tags);

  const formId = React.useId();

  async function confirm(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      await onConfirm({
        ...resource,
        title,
        tags,
        link,
      });
      setOpen(false);
      toaster.create({
        title: "resource has been submitted successfully",
        type: "success",
        closable: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      // TODO: loading is set to false after confirming the resource
      setLoading(false);
    }
  }

  return (
    <Collapsible.Root
      open={open}
      borderWidth="1px"
      borderColor="stroke"
      px="1.5em"
      py="1em"
      borderRadius="8px"
    >
      {open && (
        <Field h="2.5rem">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="plain"
            placeholder="Title"
            textStyle="h5"
            h="full"
          />
        </Field>
      )}
      <Collapsible.Trigger asChild w="full">
        {!open && (
          <Flex alignItems="center" gap="1em" justifyContent="space-between">
            <Heading as="h5">{title}</Heading>
            {resource.confirmed && (
              <Flex gap={0}>
                <IconButton variant="plain" p={0} onClick={() => setOpen(true)}>
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
        <form id={formId} onSubmit={confirm}>
          <Stack gap="3em" pt="1em">
            <Field>
              <Input
                variant="plain"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link"
                fontWeight="medium"
                lineHeight={1.4}
              />
            </Field>
            <Flex gap="1em" alignItems="center" justifyContent="space-between">
              <Tags tags={tags} onTagsChange={setTags} />
              <Flex gap="1em">
                <Button type="submit" loading={loading}>
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
        </form>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
