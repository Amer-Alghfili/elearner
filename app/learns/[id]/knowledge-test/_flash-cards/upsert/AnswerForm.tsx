import AddButton from "@/components/button/add";
import {
  createListCollection,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
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
import { useController, useFormContext } from "react-hook-form";
import { Flashcard } from "../types";

export function AnswerForm() {
  const { formState, register, control, setValue } =
    useFormContext<Flashcard>();

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
        onValueChange={({ value }) => {
          field.onChange(value);
          setValue("options", null);
          setValue("answer", "");
        }}
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
  const { control } = useFormContext<Flashcard>();
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
  const { control } = useFormContext<Flashcard>();

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
