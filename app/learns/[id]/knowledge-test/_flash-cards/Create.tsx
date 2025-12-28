import AddButton from "@/components/button/add";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Box, Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import React from "react";
import { Flashcard, postFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { FormProvider, useForm } from "react-hook-form";
import { AnswerForm } from "@/features/flashcard/AnswerForm";

export function Create({ learnId }: { learnId: number }) {
  const router = useRouter();

  const methods = useForm<Flashcard>({
    defaultValues: {
      learn_id: learnId,
    },
  });
  const { formState, handleSubmit, register } = methods;

  const [open, setOpen] = React.useState(false);

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

      setOpen(false);
      methods.reset();
    }
  }

  React.useEffect(
    function resetFormOnDialogToggle() {
      methods.reset();
    },
    [open]
  );

  return (
    <>
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Flash Card
      </AddButton>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent minW="50vw" h="100vh" overflow="auto" m={0}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)}>
              <DialogHeader px="3rem" py="5em" justifyContent="center">
                <Heading as="h2">New Flashcard</Heading>
              </DialogHeader>
              <DialogBody px="3rem" pt="2em">
                <Stack gap="1em">
                  <Field
                    required={true}
                    invalid={!!formState.errors.question}
                    label="Question"
                  >
                    <Input
                      {...register("question")}
                      placeholder="Add Question"
                    />
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
                <Button
                  loading={formState.isSubmitting}
                  type="submit"
                  w="100%"
                  maxW="12.5rem"
                >
                  Add
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
