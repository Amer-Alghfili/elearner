import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { Flashcard, postFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { EditIcon } from "@/components/Icons";
import { FormProvider, useForm } from "react-hook-form";
import { AnswerForm } from "@/features/flashcard/AnswerForm";

export function Update({ flashCard }: { flashCard: Flashcard }) {
  const router = useRouter();

  const methods = useForm<Flashcard>({
    defaultValues: {
      ...flashCard,
      hint: flashCard.hint || "",
    },
  });
  const { formState, handleSubmit, register } = methods;

  const [open, setOpen] = React.useState(false);

  async function submit(flashCard: Flashcard) {
    const { error, data } = await postFlashCard(flashCard);

    if (error) {
      toaster.create({
        title: error,
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
      methods.reset(data);
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
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent minW="50vw" h="100vh" overflow="auto" m={0}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)}>
              <DialogHeader px="3rem" py="5em" justifyContent="center">
                <Heading as="h2">Edit Flashcard</Heading>
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
                  Update
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
