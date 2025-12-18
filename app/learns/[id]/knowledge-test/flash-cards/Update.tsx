import { useElearnerCreateBlockNote } from "@/components/editor/ElearnerNoteEditor";
import { EditIcon } from "@/components/Icons";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, IconButton, Input } from "@chakra-ui/react";
import { postFlashCard, FlashCard } from "./actions";
import React from "react";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export function Update({
  learnId,
  flashCard,
}: {
  learnId: number;
  flashCard: FlashCard;
}) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, action, loading] = React.useActionState(
    postFlashCard,
    undefined
  );

  const editor = useElearnerCreateBlockNote({
    initialContent: undefined,
    style: "padding-top: 0; padding-bottom: 0; padding-inline-start: 1.5em",
  });

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
          title: "Flash card has been updated successfully 🎉",
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
      <IconButton
        onClick={() => setOpen(true)}
        variant="plain"
        p={0}
        minW="2rem"
        h="2rem"
        _hover={{ bg: "primary.transparent" }}
      >
        <EditIcon w="1rem" h="1rem" />
      </IconButton>
      <DialogContent minW="70vw">
        <form action={action}>
          <DialogHeader>
            <Field>
              <Input
                id="question"
                name="question"
                defaultValue={flashCard.question}
                variant="plain"
                textStyle="h2"
                placeholder="Flash Card question..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
          </DialogHeader>

          <DialogBody>
            <Input
              id="id"
              name="id"
              hidden={true}
              value={flashCard.id}
              readOnly={true}
            />
            <Input
              id="learnId"
              name="learnId"
              hidden={true}
              value={learnId}
              readOnly={true}
            />
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogActionTrigger>
            <Button loading={loading} type="submit">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
