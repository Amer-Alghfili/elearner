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
import { Resource as ResourceType, Tag } from "./ResourceList";
import { Tags } from "./Tags";

type ResourceProps = {
  resource: ResourceType;
  tagsOptions: Tag[];
  onConfirm: (resource: ResourceType) => Promise<boolean>;
  onRemove: (id: string) => Promise<void>;
  onDiscard: (id: string) => void;
  onAddTagOption: (tag: Omit<Tag, "id">) => Promise<boolean>;
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
  const [discarded, setDiscarded] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [link, setLink] = React.useState<string>(resource.link);

  const [title, setTitle] = React.useState(resource.title);

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
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      // TODO: loading is set to false after confirming the resource
      setLoading(false);
    }
  }

  React.useEffect(
    function discard() {
      let timeoutId: NodeJS.Timeout;
      if (discarded && !open) {
        timeoutId = setTimeout(() => onDiscard(resource.id), 300);
        setDiscarded(false);
      }

      return () => clearTimeout(timeoutId);
    },
    [discarded]
  );

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
            <Heading as="h5">{resource.title}</Heading>
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
                      Are you sure you want to delete {resource.title} ?
                    </Heading>
                  </DialogHeader>
                  <DialogBody textStyle="md">
                    Are you sure you want to delete this resource ? This action
                    cannot be undone
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
              {/* <Tags tags={tags} onTagsChange={setTags} /> */}
              <Flex gap="1em">
                <Button type="submit" loading={loading}>
                  {resource.isDraft ? "Create" : "Update"}
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setDiscarded(true);

                    setTitle(resource.title);
                    setLink(resource.link);
                    //TODO: reset tags
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
