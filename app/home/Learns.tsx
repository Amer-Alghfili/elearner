import { EditIcon } from "@/components/Icons";
import {
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  LinkBox,
  LinkOverlay,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { deleteLearn, Learn, postLearn } from "./actions";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Field } from "@/components/ui/field";
import { isZodError } from "@/types/error";
import { toaster } from "@/components/ui/toaster";
import { LuTrash } from "react-icons/lu";
import { useRouter } from "next/navigation";

export function Learns({ learns }: { learns: Learn[] }) {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  return learns.map((learn) => {
    const { id, title } = learn;

    //TODO: hover style
    return (
      <LinkBox key={id} w="full">
        <Card.Root>
          <Card.Body>
            <Stack gap={0}>
              <Flex
                alignItems="center"
                gap="1em"
                justifyContent="space-between"
              >
                <Heading as="h5">
                  <LinkOverlay href={`/learns/${id}/overview`}>
                    {title}
                  </LinkOverlay>
                </Heading>
                <Flex>
                  <Update learn={learn} />
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <IconButton
                        variant="plain"
                        p={0}
                        _hover={{ bg: "accent.softCoral.transparent" }}
                      >
                        <Icon color="accent.softCoral" w="1.3rem" h="1.3rem">
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
                        Are you sure you want to delete this learn ? This action
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

                            await deleteLearn(id);

                            router.refresh();

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
            </Stack>
          </Card.Body>
        </Card.Root>
      </LinkBox>
    );
  });
}

function Update({ learn }: { learn: Learn }) {
  const { id, title, description } = learn;

  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, formAction, isPending] = React.useActionState(
    postLearn,
    undefined
  );

  React.useEffect(
    function handleDialogState() {
      if (state == null) return;

      if (isZodError(state)) {
        toaster.create({
          title: state.errorMessage,
          type: "error",
          closable: true,
        });
      } else {
        router.refresh();

        toaster.create({
          title: "Learn has been created successfully 🎉",
          type: "success",
          closable: true,
        });

        setOpen(false);
      }
    },
    [state]
  );

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="plain" p={0} _hover={{ bg: "primary.transparent" }}>
          <EditIcon w="1.3rem" h="1.3rem" />
        </Button>
      </DialogTrigger>
      <DialogContent
        maxW="none"
        w="80%"
        bg="linear-gradient(127deg, #F4F4F2 0%, rgba(255, 255, 255, 0.7) 64%, rgba(255, 255, 255, 0.4) 100%)"
        backdropFilter="blur(80px)"
      >
        <form action={formAction}>
          <DialogHeader pb={0} px="3rem">
            <Field>
              <Input
                variant="plain"
                id="title"
                name="title"
                defaultValue={title}
                textStyle="h2"
                placeholder="Learn title..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
          </DialogHeader>
          <DialogBody px="3rem">
            <Field>
              <Textarea
                id="description"
                name="description"
                border="none"
                px={0}
                _focusVisible={{ outline: "none" }}
                resize="none"
                defaultValue={description || ""}
                textStyle="h4"
                fontWeight="medium"
                placeholder="Add description..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
            <Input hidden={true} id="id" name="id" value={id} />
          </DialogBody>
          <DialogFooter px="3rem" pt="3rem" pb="2rem">
            <DialogActionTrigger asChild>
              <Button w="100%" maxW="12.5rem" variant="secondary">
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button loading={isPending} type="submit" w="100%" maxW="12.5rem">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
