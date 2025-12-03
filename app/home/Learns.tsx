import { EditIcon } from "@/components/Icons";
import {
  Button,
  Card,
  Flex,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { Learn, postLearn } from "./actions";
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

export function Learns({
  learns,
  onUpdate,
}: {
  learns: Learn[];
  onUpdate: (learns: Learn[]) => void;
}) {
  return learns.map((learn) => {
    const { id, title } = learn;

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
                <Heading as="h4">
                  <LinkOverlay href={`/learns/${id}/overview`}>
                    {title}
                  </LinkOverlay>
                </Heading>
                <Update learn={learn} onUpdate={onUpdate} />
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>
      </LinkBox>
    );
  });
}

function Update({
  learn,
  onUpdate,
}: {
  learn: Learn;
  onUpdate: (learns: Learn[]) => void;
}) {
  const { id, title, description } = learn;

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
        onUpdate(state as Learn[]);

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
        <Button variant="plain" p={0} _hover={{ bg: "rgb(152, 109, 0, 0.2)" }}>
          <EditIcon w="24px" h="24px" />
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
              <Input
                variant="plain"
                id="description"
                name="description"
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
