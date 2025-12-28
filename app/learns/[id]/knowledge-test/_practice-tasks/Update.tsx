import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
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
import { postPracticeTask } from "./actions";
import React from "react";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEditorChange } from "@blocknote/react";
import { PracticeTask } from "./types";

export function Update({
  learnId,
  practiceTask,
}: {
  learnId: number;
  practiceTask: PracticeTask;
}) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, action, loading] = React.useActionState(
    postPracticeTask,
    undefined
  );

  const [description, setDescription] = React.useState<string>(
    practiceTask.description
  );

  const editor = useElearnerCreateBlockNote({
    initialContent: undefined,
    style: "padding-top: 0; padding-bottom: 0; padding-inline-start: 1.5em",
  });

  useEditorChange((editor) => {
    const html = editor.blocksToFullHTML(editor.document);
    setDescription(html);
  }, editor);

  React.useEffect(
    function resetEditor() {
      if (!open) {
        const blocks = editor.tryParseHTMLToBlocks(practiceTask.description);

        editor.replaceBlocks(editor.document, blocks);
      }
    },
    [open, practiceTask.description]
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
          title: "Practice task has been updated successfully 🎉",
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
        <EditIcon w="1.2rem" h="1.2rem" />
      </IconButton>
      <DialogContent minW="70vw">
        <form action={action}>
          <DialogHeader>
            <Field>
              <Input
                id="title"
                name="title"
                defaultValue={practiceTask.title}
                variant="plain"
                textStyle="h2"
                placeholder="Practice Task title..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
          </DialogHeader>

          <DialogBody>
            <ElearnerNoteEditor key={open.toString()} editor={editor} />
            <Input
              id="description"
              name="description"
              hidden={true}
              value={description}
              readOnly={true}
            />
            <Input
              id="id"
              name="id"
              hidden={true}
              value={practiceTask.id}
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
