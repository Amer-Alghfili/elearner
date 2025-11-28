"use client";

import AddButton from "@/components/button/add";
import {
  Box,
  Button,
  Circle,
  Collapsible,
  ColorPalette,
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
import { EditIcon, TagIcon } from "@/components/Icons";
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
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { colors } from "@/theme/color-palattes";

type ResourceType = Omit<Prisma.ResourceModel, "id"> & {
  id: string;
  confirmed: boolean;
};
export default function ResourcesTabPage() {
  const ctx = useLearn();

  const [resources, setResources] = React.useState<ResourceType[]>(
    (ctx.resources as Prisma.ResourceModel[]).map((resource) => ({
      ...resource,
      id: resource.id.toString(),
      confirmed: true,
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
        tags: null,
        learn_id: ctx.id,
        confirmed: false,
      },
    ]);
  }

  function confirm(index: number, resource: ResourceType) {
    const copy = [...resources];

    copy[index] = { ...resource, confirmed: true };

    setResources(copy);
  }

  function remove(index: number) {
    const copy = [...resources];
    console.log(copy);
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
  onConfirm: (resource: ResourceType) => void;
  onCancel: VoidFunction;
  onRemove: VoidFunction;
};
function Resource({ resource, onConfirm, onCancel, onRemove }: ResourceProps) {
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
              <Tags />
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

function Tags() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [colorMenuOpen, setColorMenuOpen] = React.useState<boolean>(false);
  const [tagMenuOpen, setTagMenuOpen] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");

  const [tags, setTags] = React.useState<{ label: string; color: string }[]>(
    []
  );

  function createTag(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setColorMenuOpen(true);
    setTagMenuOpen(false);
    setOpen(false);
  }

  function addTag(color: string) {
    setTags([...tags, { label: search, color }]);

    setColorMenuOpen(false);
    setTagMenuOpen(true);
    setOpen(false);
  }

  React.useEffect(
    function reopen() {
      if (!open && (colorMenuOpen || tagMenuOpen)) {
        setOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorMenuOpen, tagMenuOpen]
  );

  return (
    <>
      <MenuRoot
        open={open}
        onOpenChange={({ open }) => {
          if (!open) {
            setColorMenuOpen(false);
            setTagMenuOpen(false);
          } else {
            setTagMenuOpen(true);
          }
          setOpen(open);
        }}
        composite={false}
      >
        <MenuTrigger asChild>
          <Button
            className="group"
            variant="plain"
            textStyle="sm-medium"
            p={0}
            gap="0.3em"
            color="text.secondary"
            _hover={{
              color: "primary.thick",
            }}
          >
            <TagIcon
              transition="all 0.2s ease-in-out"
              _groupHover={{ fill: "primary.thick" }}
            />
            Add Tag
          </Button>
        </MenuTrigger>
        <MenuContent>
          {colorMenuOpen &&
            colors.map((color) => (
              <MenuItem key={color} value={color} onClick={() => addTag(color)}>
                <Circle size="0.5rem" bg={color} />
                {color}
              </MenuItem>
            ))}
          {tagMenuOpen && (
            <form onSubmit={createTag}>
              <Field>
                <Input
                  size="sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Field>
              <AddButton type="submit" w="full" justifyContent="flex-start">
                Create Tag
              </AddButton>
            </form>
          )}
        </MenuContent>
      </MenuRoot>
    </>
  );
}
