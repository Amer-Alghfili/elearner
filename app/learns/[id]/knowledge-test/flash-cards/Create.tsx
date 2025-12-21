import AddButton from "@/components/button/add";
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
  createListCollection,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { FlashCard, postFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";
import { CheckboxIcon, PaperWriteIcon, TickIcon } from "@/components/Icons";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { v4 } from "uuid";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";
import { LuTrash } from "react-icons/lu";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";

export function Create({ learnId }: { learnId: number }) {
  const router = useRouter();

  const methods = useForm<FlashCard>({
    defaultValues: {
      learn_id: learnId,
    },
  });
  const { formState, handleSubmit, register } = methods;

  const [open, setOpen] = React.useState(false);

  async function submit(flashCard: FlashCard) {
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

                    // helperText="e.g. What is the capital of England ?"
                  >
                    <Input
                      {...register("question")}
                      placeholder="Add Question"
                    />
                  </Field>
                  <Field
                    invalid={!!formState.errors.hint}
                    // helperText="Hint that can be toggled when trying to answer"
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

function AnswerForm() {
  const { formState, register, control } = useFormContext<FlashCard>();

  const { field } = useController({
    name: "answerType",
    control,
  });

  const color = {
    checked: "primary",
    default: "text.caption",
  };

  return (
    <Stack gap="2em">
      <RadioCardRoot
        disabled={field.disabled}
        value={field.value}
        onValueChange={({ value }) => field.onChange(value)}
        onBlur={field.onBlur}
      >
        <RadioCardLabel>Choose answer type</RadioCardLabel>
        <Stack gap="0.7em">
          <RadioCardItem
            icon={
              <CheckboxIcon
                stroke={
                  field.value === "multiple-choices"
                    ? color.checked
                    : color.default
                }
                w="1.8rem"
                h="1.8rem"
              />
            }
            value="multiple-choices"
            label="Multiple Choices"
          />
          <RadioCardItem
            value="true-false"
            label="True/False"
            icon={
              <TickIcon
                stroke={
                  field.value === "true-false" ? color.checked : color.default
                }
                fill={
                  field.value === "true-false" ? color.checked : color.default
                }
                w="1.5rem"
                h="1.5rem"
              />
            }
          />
          <RadioCardItem
            value="open-ended"
            label="Open ended"
            icon={
              <PaperWriteIcon
                stroke={
                  field.value === "open-ended" ? color.checked : color.default
                }
                fill={
                  field.value === "open-ended" ? color.checked : color.default
                }
                w="1.5rem"
                h="1.5rem"
              />
            }
          />
        </Stack>
      </RadioCardRoot>
      {field.value === "multiple-choices" && <MultipleChoiceAnswerForm />}
      {field.value === "true-false" && <TrueFalseAnswerForm />}
      {field.value === "open-ended" && (
        <Field
          invalid={!!formState.errors.answer}
          required={true}
          label="Answer"
        >
          <Textarea {...register("answer")} />
        </Field>
      )}
    </Stack>
  );
}

function MultipleChoiceAnswerForm() {
  const { control } = useFormContext<FlashCard>();
  const { field } = useController({
    control,
    name: "answer",
  });

  const { field: optionsField } = useController({
    control,
    name: "options",
    defaultValue: [""],
  });
  const { onChange } = optionsField;
  const [options, setOptions] = React.useState<
    { key: string; value: string }[]
  >((optionsField.value || []).map((v) => ({ key: v4(), value: v })));

  const collection = createListCollection({
    items: (options || []).filter(({ value }) => value.trim()),
  });

  function addOption() {
    onChange([...options.map(({ value }) => value), ""]);
    setOptions([...options, { key: v4(), value: "" }]);
  }

  function editOption(index: number, value: string) {
    const copy = [...options];
    copy[index] = { ...copy[index], value };

    onChange(copy.map(({ value }) => value));
    setOptions(copy);
  }

  function deleteOption(index: number) {
    const copy = [...options];
    copy.splice(index, 1);

    onChange(copy.map(({ value }) => value));
    setOptions(copy);
  }

  return (
    <Stack gap="1.5em">
      <Stack gap={0}>
        <AddButton alignSelf="flex-start" onClick={addOption}>
          New Option
        </AddButton>
        <Stack>
          {options.map((option, index) => (
            <InputGroup
              key={option.key}
              endElement={
                <IconButton className="group" variant="plain" p={0}>
                  <Icon
                    onClick={() => deleteOption(index)}
                    color="accent.softCoral"
                    _groupHover={{ color: "feedback.error" }}
                    w="1.3rem"
                    h="1.3rem"
                  >
                    <LuTrash />
                  </Icon>
                </IconButton>
              }
            >
              <Input
                value={option.value}
                onChange={(e) => editOption(index, e.target.value)}
                placeholder="Enter option"
                _placeholder={{ textStyle: "md" }}
              />
            </InputGroup>
          ))}
        </Stack>
      </Stack>
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
              <SelectItem item={option} key={option.key}>
                {option.value}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectRoot>
    </Stack>
  );
}

function TrueFalseAnswerForm() {
  const { control } = useFormContext<FlashCard>();

  const { field } = useController({
    control,
    name: "answer",
  });

  return (
    <Field label="Answer" required={true}>
      <RadioGroup
        value={field.value}
        onValueChange={({ value }) => field.onChange(value)}
        onBlur={field.onBlur}
      >
        <Flex gap="2em">
          <Radio value="true">True</Radio>
          <Radio value="false">False</Radio>
        </Flex>
      </RadioGroup>
    </Field>
  );
}
