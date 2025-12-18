import AddButton from "@/components/button/add";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Button, Input } from "@chakra-ui/react";
import React from "react";
import { postFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";

export function Create({ learnId }: { learnId: number }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, action, loading] = React.useActionState(
    postFlashCard,
    undefined
  );

  React.useEffect(
    function refreshAfterMutation() {
      if (state == null) return;

      if (state.error) {
        toaster.create({
          title: state.error,
          type: "error",
          closable: true,
        });
      } else {
        router.refresh();

        toaster.create({
          title: "Flash card has been created successfully 🎉",
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
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Flash Card
      </AddButton>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent minW="70vw">
          <form action={action}>
            <DialogHeader px="3rem">
              <Field>
                <Input
                  id="title"
                  name="title"
                  variant="plain"
                  textStyle="h2"
                  placeholder="Flash Card question..."
                  _placeholder={{ color: "#7A7A7A" }}
                />
              </Field>
            </DialogHeader>
            <DialogBody px="3rem">
              <Input
                id="learnId"
                name="learnId"
                hidden={true}
                value={learnId}
                readOnly={true}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                w="100%"
                maxW="12.5rem"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button loading={loading} type="submit" w="100%" maxW="12.5rem">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
