import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/editor/ElearnerNoteEditor";
import { EditIcon } from "@/components/Icons";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, IconButton, Input } from "@chakra-ui/react";
import { postPracticeTask, PracticeTask } from "./actions";
import React from "react";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export function Update({
  learnId,
  practiceTask,
}: {
  learnId: number;
  practiceTask: PracticeTask;
}) {
  const router = useRouter();

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

  editor.onChange((editor) => setDescription(editor.blocksToMarkdownLossy()));

  React.useEffect(function initEditor() {
    const blocks = editor.tryParseMarkdownToBlocks(practiceTask.description);

    editor.replaceBlocks(editor.document, blocks);
  }, []);

  React.useEffect(
    function resetEditor() {
      if (!open) {
        if (editor.document && editor.document.length > 1) {
          let notFound = false;

          for (const block of editor.document) {
            notFound = editor.getBlock(block.id) == null;

            if (notFound) return;
          }

          editor.removeBlocks(editor.document.map(({ id }) => id));
        }
      }
    },
    [open]
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
          title: "Practice task has been created successfully 🎉",
          type: "success",
          closable: true,
        });
      }
    },
    [state]
  );

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton
          variant="plain"
          p={0}
          _hover={{ bg: "primary.transparent" }}
        >
          <EditIcon />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
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
        <form>
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
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
