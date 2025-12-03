import {
  Button,
  Collapsible,
  DialogHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  LinkBox,
  LinkOverlay,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
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
import { Resource as ResourceType, Tag as TagType } from "./ResourceList";
import { Tags } from "./Tags";
import { Tag } from "@/components/ui/tag";
import Link from "next/link";

type ResourceProps = {
  resource: ResourceType;
  tagsOptions: TagType[];
  onConfirm: (resource: ResourceType) => Promise<boolean>;
  onRemove: (id: string) => Promise<void>;
  onDiscard: (id: string) => void;
  onAddTagOption: (tag: Omit<TagType, "id">) => Promise<number | undefined>;
};
export function Resource({
  resource,
  tagsOptions,
  onConfirm,
  onRemove,
  onDiscard,
  onAddTagOption,
}: ResourceProps) {
  const [open, setOpen] = React.useState(resource.isDraft);

  const [loading, setLoading] = React.useState(false);

  const [title, setTitle] = React.useState(resource.title);
  const [link, setLink] = React.useState<string>(resource.link);
  const [selectedTags, setSelectedTags] = React.useState<number[]>(
    resource.tags || []
  );

  const formId = React.useId();

  async function confirm(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      setOpen(
        !(await onConfirm({
          ...resource,
          title,
          link,
          tags: selectedTags,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function replaceTags(tags: number[]) {
    console.log(tags);
    setSelectedTags(tags);
  }

  async function addTagAndToggle(tag: TagType) {
    try {
      const res = await onAddTagOption(tag);

      if (typeof res === "number") {
        setSelectedTags([...selectedTags, res]);
      }
    } catch (err) {
      throw err;
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
          <LinkBox>
            <Flex alignItems="center" gap="1em" justifyContent="space-between">
              <LinkOverlay href={resource.link} target="_blank">
                <Heading as="h5">{resource.title}</Heading>
              </LinkOverlay>
              <Wrap>
                {selectedTags.map((tagId) => {
                  const tag = tagsOptions.find(({ id }) => tagId === id);
                  if (tag == null) throw Error("tag not found");

                  return (
                    <Tag key={tagId} colorPalette={tag.color}>
                      {tag.label}
                    </Tag>
                  );
                })}
              </Wrap>
              <Flex gap={0}>
                <IconButton
                  variant="plain"
                  p={0}
                  onClick={() => setOpen(true)}
                  _hover={{ bg: "primary.transparent" }}
                >
                  <EditIcon />
                </IconButton>
                <DialogRoot>
                  <DialogTrigger asChild>
                    <IconButton
                      variant="plain"
                      p={0}
                      _hover={{ bg: "accent.softCoral.transparent" }}
                    >
                      <Icon color="accent.softCoral">
                        <LuTrash />
                      </Icon>
                    </IconButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <Heading as="h4" lineHeight="1.6">
                        Are you sure you want to delete {resource.title} ?
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
                      <Button
                        loading={loading}
                        bg="feedback.error"
                        onClick={async () => {
                          setLoading(true);

                          await onRemove(resource.id);

                          setLoading(false);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogRoot>
              </Flex>
            </Flex>
          </LinkBox>
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
              <Tags
                tags={tagsOptions}
                selectedTags={selectedTags.map((tag) => tag.toString())}
                onAdd={addTagAndToggle}
                onChange={replaceTags}
              />
              <Flex gap="1em">
                <Button type="submit" loading={loading}>
                  {resource.isDraft ? "Create" : "Update"}
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    onDiscard(resource.id);

                    setTitle(resource.title);
                    setLink(resource.link);
                    setSelectedTags(resource.tags);
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
