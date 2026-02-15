import {
  Box,
  Button,
  Card,
  createListCollection,
  Flex,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Flashcard } from "../../_flashcard-form/types";
import { updateDueDate } from "../../_flashcard-form/actions";

export function FlashcardItem({ flashcard }: { flashcard: Flashcard }) {
  const { question, answer } = flashcard;

  const [open, setOpen] = React.useState(false);
  const [flip, setFlip] = React.useState(false);

  const router = useRouter();

  const answerForm = useForm<{ answer: string }>();

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = useForm<Flashcard>({
    defaultValues: {
      ...flashcard,
      stage: null,
    },
  });

  const { field } = useController({
    control,
    name: "stage",
  });

  function validateAnswer({ answer: submittedAnswer }: { answer: string }) {
    if (submittedAnswer === answer) {
      setFlip((prev) => !prev);
    } else {
      answerForm.setError("answer", { message: "Wrong answer, try again" });
    }
  }

  async function finishReview(flashcard: Flashcard) {
    if (flashcard.stage == null) {
      toaster.create({
        title: "Please select a stage",
        type: "error",
        closable: true,
      });

      return;
    }

    try {
      await updateDueDate(flashcard.id, Number(flashcard.stage));

      toaster.create({
        title: "You have reviewed Flashcard, keep going",
        type: "success",
        closable: true,
      });

      setOpen(false);
      router.refresh();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
        closable: true,
      });
    }
  }

  const front = (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
    >
      <FormProvider {...answerForm}>
        <Box
          as="form"
          onSubmit={answerForm.handleSubmit(validateAnswer)}
          w="full"
          h="full"
        >
          <Stack h="full" w="full">
            <DialogBody overflow={!flip ? "auto" : "visible"}>
              <Stack
                h="full"
                justifyContent="center"
                alignItems="center"
                gap="3em"
              >
                <Heading as="h3">{question}</Heading>
                {flashcard.answerType === "open-ended" && (
                  <Field
                    invalid={!!answerForm.formState.errors.answer}
                    errorText={answerForm.formState.errors.answer?.message}
                  >
                    <Textarea
                      {...answerForm.register("answer")}
                      placeholder="Add answer..."
                    />
                  </Field>
                )}
                {flashcard.answerType === "true-false" && <TrueFalseField />}
                {flashcard.answerType === "multiple-choices" && (
                  <MultipleChoicesField options={flashcard.options || []} />
                )}
              </Stack>
            </DialogBody>
            <DialogFooter justifyContent="space-between" px="4em">
              {flashcard.hint != null && (
                <Tooltip content={flashcard.hint} showArrow={true}>
                  <Button
                    variant="plain"
                    color="primary"
                    textDecoration="underline"
                  >
                    Show Hint
                  </Button>
                </Tooltip>
              )}
              <Flex gap="1em">
                <DialogActionTrigger asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogActionTrigger>
                <Button type="submit">Finish</Button>
              </Flex>
            </DialogFooter>
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  );

  const nextStage =
    flashcard.stage === "4" ? "4" : `${Number(flashcard.stage as string) + 1}`;

  const back = (
    <Stack
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
      transform="rotateY(180deg)"
      bg="feedback.success.transparent"
    >
      <DialogBody overflow={flip ? "auto" : "visible"}>
        <Stack h="full" justifyContent="center" alignItems="center" gap="3em">
          <Stack alignItems="center" gap="2em">
            <Box textStyle="h2">🎉</Box>
            <Heading as="h3">Got it!</Heading>
          </Stack>
          <Text textStyle="md-medium">
            You have nailed it. What do you want to do with this flashcard ?
          </Text>
          <RadioCardRoot
            gap="1em"
            onValueChange={({ value }) => field.onChange(value)}
          >
            <RadioCardItem
              indicator={null}
              borderColor="feedback.success"
              _checked={{
                bg: "feedback.success.transparent",
              }}
              value={nextStage}
              label={
                <Stack>
                  <Text color="text.secondary">
                    I did great, move it to next stage (#
                    {nextStage})
                  </Text>
                </Stack>
              }
            />
            <RadioCardItem
              indicator={null}
              borderColor="feedback.success"
              _checked={{
                bg: "feedback.success.transparent",
              }}
              value={`${flashcard.stage}`}
              label={
                <Stack>
                  <Text color="text.secondary">
                    Need further review, keep it in the current stage (#
                    {Number(flashcard.stage)})
                  </Text>
                </Stack>
              }
            />
          </RadioCardRoot>
        </Stack>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={() => setFlip((prev) => !prev)}
          variant="secondary"
          borderColor="text.secondary"
          color="text.secondary"
        >
          Flip Back
        </Button>
        <form onSubmit={handleSubmit(finishReview)}>
          <Button loading={isSubmitting} type="submit" bg="feedback.success">
            Proceed
          </Button>
        </form>
      </DialogFooter>
    </Stack>
  );

  return (
    <Card.Root bg="transparent">
      <Card.Header pt="1em" pb={0}>
        <Heading
          as="h5"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {question}
        </Heading>
      </Card.Header>
      <Card.Body py="1em">
        <DialogRoot
          open={open}
          onOpenChange={({ open }) => {
            if (!open) {
              setFlip(false);
            }
            setOpen(open);
            answerForm.reset();
            reset();
          }}
          closeOnInteractOutside={false}
        >
          <DialogTrigger asChild>
            <Button variant="plain" color="primary" alignSelf="flex-end">
              Start
            </Button>
          </DialogTrigger>
          <DialogContent
            w="50vw"
            h="90vh"
            mt="2em"
            maxW="none"
            maxH="none"
            justifyContent="center"
            alignItems="center"
            perspective="2000px"
            bg="transparent"
            boxShadow="none"
          >
            <Stack
              transition="all 0.5s ease-in-out"
              transform={flip ? "rotateY(180deg)" : "rotateY(0)"}
              transformStyle="preserve-3d"
              position="relative"
              bg="white"
              w="full"
              h="full"
              borderRadius="8px"
              boxShadow="md"
            >
              {front}
              {back}
            </Stack>
          </DialogContent>
        </DialogRoot>
      </Card.Body>
    </Card.Root>
  );
}

function TrueFalseField() {
  const { formState, control } = useFormContext<{ answer: "true" | "false" }>();

  const { field } = useController({
    name: "answer",
    control,
  });

  React.useEffect(
    function toastError() {
      if (formState.errors.answer) {
        setTimeout(() => {
          toaster.create({
            title: "Wrong answer, please try again",
            type: "error",
            closable: true,
          });
        }, 0);
      }
    },
    [formState.errors.answer]
  );

  return (
    <RadioCardRoot
      w="full"
      gap={0}
      flexDirection="row"
      onValueChange={({ value }) => field.onChange(value)}
    >
      <RadioCardItem
        alignItems="center"
        borderRadius="none"
        indicator={null}
        value="true"
        label="True"
      />
      <RadioCardItem
        alignItems="center"
        borderRadius="none"
        indicator={null}
        value="false"
        label="False"
      />
    </RadioCardRoot>
  );
}

function MultipleChoicesField({ options }: { options: readonly string[] }) {
  const collection = createListCollection({
    items: options,
  });

  const { formState, control } = useFormContext<{ answer: string }>();

  const { field } = useController({
    name: "answer",
    control,
  });

  return (
    <Field
      invalid={!!formState.errors.answer}
      errorText={formState.errors.answer?.message}
      w={{ base: "100%", md: "70%" }}
    >
      <SelectRoot
        required={true}
        disabled={field.disabled}
        collection={collection}
        value={[field.value]}
        onValueChange={({ value }) => field.onChange(value[0])}
        onBlur={field.onBlur}
      >
        <SelectLabel textStyle="sm-semibold">Answer</SelectLabel>
        <SelectTrigger>{field.value}</SelectTrigger>
        <SelectContent portalled={false}>
          {collection.items.map((option) => {
            return (
              <SelectItem key={option} item={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}
