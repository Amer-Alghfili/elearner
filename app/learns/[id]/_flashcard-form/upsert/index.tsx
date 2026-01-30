import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { FormProvider, useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { AnswerForm } from "./AnswerForm";
import { Flashcard } from "../../knowledge-test/_flash-cards/types";
import { postFlashCard } from "../../knowledge-test/_flash-cards/actions";
import { useLearnControlManagement } from "../../LearnPageContainer";
import React from "react";

export default function Upsert({ learnId }: { learnId: number }) {
  const { flashcardForm, toggleFlashcardForm } = useLearnControlManagement();

  const router = useRouter();

  const methods = useForm<Flashcard>({
    defaultValues: flashcardForm.flashcard
      ? { ...flashcardForm.flashcard }
      : { learn_id: learnId },
  });
  const { formState, handleSubmit, register } = methods;

  async function submit(flashCard: Flashcard) {
    const { error } = await postFlashCard(flashCard);

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

      toggleFlashcardForm({});
    }
  }

  React.useEffect(
    function resetForm() {
      methods.reset();
    },
    [flashcardForm.open]
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
          {flashcardForm.flashcard == null
            ? "New Flashcard"
            : `Update '${flashcardForm.flashcard.question}'`}
        </Heading>
        <Stack gap="1em">
          <Field
            required={true}
            invalid={!!formState.errors.question}
            label="Question"
          >
            <Input {...register("question")} placeholder="Add Question" />
          </Field>
          <Field
            invalid={!!formState.errors.hint}
            label={
              <Flex gap="0.2em">
                <Box>Hint</Box>
                <Box color="text.caption" textStyle="sm">
                  (optional)
                </Box>
              </Flex>
            }
          >
            <Input {...register("hint")} />
          </Field>
          <AnswerForm />
        </Stack>
        <Flex gap="1em">
          <Button
            w="100%"
            maxW="12.5rem"
            variant="secondary"
            onClick={() => toggleFlashcardForm({})}
          >
            Cancel
          </Button>
          <Button
            loading={formState.isSubmitting}
            type="submit"
            w="100%"
            maxW="12.5rem"
          >
            {flashcardForm.flashcard == null ? "Add" : "Update"}
          </Button>
        </Flex>
      </Stack>
    </FormProvider>
  );
}
