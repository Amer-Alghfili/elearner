import AddButton, { AddButtonProps } from "@/components/button/add";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, ButtonProps, Input } from "@chakra-ui/react";
import React from "react";
import { postLearn, Learn } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { isZodError } from "@/types/error";

export default function CreateLearn({
  onCreate,
  ...props
}: {
  onCreate: (learns: Learn[]) => void;
} & AddButtonProps) {
  const [open, setOpen] = React.useState<boolean>();

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
        onCreate(state as Learn[]);

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
    <>
      <AddButton
        onClick={() => setOpen(true)}
        textStyle="h4"
        iconProps={{ w: "1.9375rem", h: "1.9375rem" }}
        {...props}
      >
        New Learn
      </AddButton>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
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
                  id="title"
                  name="title"
                  variant="plain"
                  textStyle="h2"
                  placeholder="Learn title..."
                  _placeholder={{ color: "#7A7A7A" }}
                />
              </Field>
            </DialogHeader>
            <DialogBody px="3rem">
              <Field>
                <Input
                  id="description"
                  name="description"
                  variant="plain"
                  textStyle="h4"
                  fontWeight="medium"
                  placeholder="Add description..."
                  _placeholder={{ color: "#7A7A7A" }}
                />
              </Field>
            </DialogBody>
            <DialogFooter px="3rem" pt="3rem" pb="2rem">
              <Button
                w="100%"
                maxW="12.5rem"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button loading={isPending} type="submit" w="100%" maxW="12.5rem">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
