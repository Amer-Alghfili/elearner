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
  Icon,
  IconButton,
  Input,
  InputGroup,
  RadioCardItemText,
  Stack,
  Textarea,
  Wrap,
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
        <DialogContent minW="70vw">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)}>
              <DialogHeader px="3rem">
                <Field required={true} invalid={!!formState.errors.question}>
                  <Input
                    {...register("question")}
                    variant="plain"
                    textStyle="h2"
                    placeholder="Flash Card question..."
                    _placeholder={{ color: "#7A7A7A" }}
                  />
                </Field>
              </DialogHeader>
              <DialogBody px="3rem">
                <AnswerForm />
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

  return (
    <Stack gap="3em">
      <RadioCardRoot
        disabled={field.disabled}
        value={field.value}
        onValueChange={({ value }) => field.onChange(value)}
        onBlur={field.onBlur}
        gap="1.2em"
      >
        <RadioCardLabel mt="1em">Choose answer type</RadioCardLabel>
        <Wrap gap="1.5em">
          <RadioCardItem
            alignItems="center"
            indicator={<></>}
            icon={<CheckboxIcon w="5rem" h="5rem" />}
            value="multiple-choices"
            label={
              <RadioCardItemText mt="1em" textAlign="center">
                Multiple Choices
              </RadioCardItemText>
            }
            boxShadow="md"
            _checked={{
              bg: "primary.transparent",
              borderColor: "primary.transparent",
              boxShadow: "2xl",
            }}
          />
          <RadioCardItem
            alignItems="center"
            indicator={<></>}
            value="true-false"
            label={
              <RadioCardItemText mt="1em" textAlign="center">
                True/False
              </RadioCardItemText>
            }
            icon={<TickIcon w="5rem" h="5rem" />}
            boxShadow="md"
            _checked={{
              bg: "primary.transparent",
              borderColor: "primary.transparent",
              boxShadow: "2xl",
            }}
          />
          <RadioCardItem
            alignItems="center"
            indicator={<></>}
            value="open-ended"
            label={
              <RadioCardItemText textAlign="center">
                Open ended
              </RadioCardItemText>
            }
            icon={<PaperWriteIcon w="5rem" h="5rem" />}
            boxShadow="md"
            _checked={{
              bg: "primary.transparent",
              borderColor: "primary.transparent",
              boxShadow: "2xl",
            }}
          />
        </Wrap>
      </RadioCardRoot>
      <Field
        invalid={!!formState.errors.hint}
        helperText="Hint that can be toggled when trying to answer"
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
      {/* {field.value === "multiple-choices" && <MultipleChoiceAnswerForm />} */}
      {/* {field.value === "true-false" && <TrueFalseAnswerForm />} */}
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
  const [options, setOptions] = React.useState<
    { key: string; value: string }[]
  >([]);

  const [answer, setAnswer] = React.useState<string>("");

  const collection = createListCollection({
    items: options.filter(({ value }) => value.trim()),
  });

  function editOption(index: number, value: string) {
    const copy = [...options];
    copy[index].value = value;

    setOptions(copy);
  }

  function deleteOption(index: number) {
    const copy = [...options];
    copy.splice(index, 1);

    setOptions(copy);
  }

  return (
    <Stack gap="1.5em">
      <Stack gap={0}>
        <AddButton
          alignSelf="flex-start"
          onClick={() => setOptions([{ key: v4(), value: "" }, ...options])}
        >
          New Option
        </AddButton>
        <Stack>
          {options.map(({ key, value }, index) => (
            <InputGroup
              key={key}
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
                value={value}
                onChange={(e) => editOption(index, e.target.value)}
                size="sm"
              />
            </InputGroup>
          ))}
        </Stack>
      </Stack>
      <Input
        hidden={true}
        value={JSON.stringify(options)}
        name="options"
        id="options"
      />
      <SelectRoot
        size="sm"
        collection={collection}
        value={[answer]}
        onValueChange={({ value }) => setAnswer(value[0])}
      >
        <SelectLabel textStyle="sm-semibold">Answer</SelectLabel>
        <SelectTrigger>{answer}</SelectTrigger>
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
      <Input hidden={true} value={answer} name="answer" id="answer" />
    </Stack>
  );
}

function TrueFalseAnswerForm() {
  return (
    <Field id="answer" label="Answer" required={true}>
      <RadioGroup name="answer">
        <Flex gap="2em">
          <Radio value="true">True</Radio>
          <Radio value="false">False</Radio>
        </Flex>
      </RadioGroup>
    </Field>
  );
}
