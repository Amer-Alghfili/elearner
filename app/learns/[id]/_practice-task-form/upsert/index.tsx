import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useLearnControlManagement } from "../../LearnPageContainer";
import React from "react";
import { PracticeTask } from "../types";
import {
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
import { useEditorChange } from "@blocknote/react";
import { postPracticeTask } from "../actions";
import { ClockIcon } from "@/components/Icons";
import { dateDiffInDays } from "@/util/date";

export default function Upsert({ learnId }: { learnId: number }) {
  const { practiceTaskForm, togglePracticeTaskForm } =
    useLearnControlManagement();

  const router = useRouter();

  const methods = useForm<PracticeTask>({
    defaultValues: practiceTaskForm.practiceTask
      ? { ...practiceTaskForm.practiceTask }
      : { learn_id: learnId },
  });
  const { formState, handleSubmit, register } = methods;

  async function submit(practiceTask: PracticeTask) {
    const { error } = await postPracticeTask(practiceTask);

    if (error) {
      toaster.create({
        title: error,
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

      togglePracticeTaskForm({});
    }
  }

  React.useEffect(
    function resetForm() {
      methods.reset();
    },
    [practiceTaskForm.open]
  );

  return (
    <FormProvider {...methods}>
      <Stack
        as="form"
        onSubmit={handleSubmit(submit)}
        px="2em"
        py="7em"
        gap="3em"
      >
        <Heading as="h2">
          {practiceTaskForm.practiceTask == null
            ? "New Practice Task"
            : `Update '${practiceTaskForm.practiceTask.title}'`}
        </Heading>
        {practiceTaskForm.practiceTask != null && (
          <Flex alignItems="center" gap="0.25em">
            <ClockIcon w="1.1rem" h="1.1rem" />
            <Box textStyle="md-medium" color="primary">
              Due in{" "}
              {dateDiffInDays(practiceTaskForm.practiceTask.due, new Date())}{" "}
              days
            </Box>
          </Flex>
        )}
        <Stack gap="1em">
          <Field
            required={true}
            invalid={!!formState.errors.title}
            label="Title"
          >
            <Input {...register("title")} placeholder="Add Title" />
          </Field>
          <DescriptionEditor />
        </Stack>
        <Flex gap="1em">
          <Button
            w="100%"
            maxW="12.5rem"
            variant="secondary"
            onClick={() => togglePracticeTaskForm({})}
          >
            Cancel
          </Button>
          <Button
            loading={formState.isSubmitting}
            type="submit"
            w="100%"
            maxW="12.5rem"
          >
            {practiceTaskForm.practiceTask == null ? "Add" : "Update"}
          </Button>
        </Flex>
      </Stack>
    </FormProvider>
  );
}

function DescriptionEditor() {
  const { practiceTaskForm } = useLearnControlManagement();

  const methods = useFormContext<PracticeTask>();

  const { field } = useController({
    name: "description",
    control: methods.control,
  });

  const editor = useElearnerCreateBlockNote({
    initialContent: undefined,
    style: "padding-top: 0; padding-bottom: 0; padding-inline-start: 1.5em",
  });

  React.useEffect(
    function resetEditor() {
      if (practiceTaskForm.practiceTask) {
        const blocks = editor.tryParseHTMLToBlocks(
          practiceTaskForm.practiceTask.description
        );

        editor.replaceBlocks(editor.document, blocks);
      }
    },
    [practiceTaskForm.practiceTask]
  );

  useEditorChange((editor) => {
    const html = editor.blocksToFullHTML(editor.document);
    field.onChange(html);
  }, editor);

  return <ElearnerNoteEditor editor={editor} />;
}
