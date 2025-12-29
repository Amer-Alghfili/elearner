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
import { postPracticeTask } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
import { useEditorChange } from "@blocknote/react";

export function Create({ learnId }: { learnId: number }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, action, loading] = React.useActionState(
    postPracticeTask,
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

        setTimeout(() => {
          toaster.create({
            title: "Practice task has been created successfully 🎉",
            type: "success",
            closable: true,
          });

          setOpen(false);
        }, 0);
      }
    },
    [state]
  );

  return (
    <>
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Practice Task
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
                  placeholder="Practice Task title..."
                  _placeholder={{ color: "#7A7A7A" }}
                />
              </Field>
            </DialogHeader>
            <DialogBody px="3rem">
              <DescriptionEditor key={open.toString()} />
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

function DescriptionEditor() {
  const [description, setDescription] = React.useState<string>();

  const editor = useElearnerCreateBlockNote({
    initialContent: undefined,
    style: "padding-top: 0; padding-bottom: 0; padding-inline-start: 1.5em",
  });

  useEditorChange((editor) => {
    const html = editor.blocksToFullHTML(editor.document);
    setDescription(html);
  }, editor);

  return (
    <>
      <Input
        id="description"
        name="description"
        hidden={true}
        value={description}
        readOnly={true}
      />
      <ElearnerNoteEditor editor={editor} />
    </>
  );
}
