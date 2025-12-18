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
  FieldLabel,
  Flex,
  Input,
  RadioCardItemText,
  Stack,
  Textarea,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { AnswerType, postFlashCard } from "./actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";
import { CheckboxIcon, PaperWriteIcon, TickIcon } from "@/components/Icons";

export function Create({ learnId }: { learnId: number }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const [state, action, loading] = React.useActionState(
    postFlashCard,
    undefined
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
          title: "Flash card has been created successfully 🎉",
          type: "success",
          closable: true,
        });

        setOpen(false);
      }
    },
    [state]
  );

  return (
    <>
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Flash Card
      </AddButton>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent minW="70vw">
          <form action={action}>
            <DialogHeader px="3rem">
              <Field>
                <Input
                  id="question"
                  name="question"
                  variant="plain"
                  textStyle="h2"
                  placeholder="Flash Card question..."
                  _placeholder={{ color: "#7A7A7A" }}
                />
              </Field>
            </DialogHeader>
            <DialogBody px="3rem">
              <Input
                id="learnId"
                name="learnId"
                hidden={true}
                value={learnId}
                readOnly={true}
              />
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
              <Button loading={loading} type="submit" w="100%" maxW="12.5rem">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

function AnswerForm() {
  const [answerType, setAnswerType] = React.useState<AnswerType>();

  return (
    <Stack gap="3em">
      <RadioCardRoot
        value={answerType}
        onValueChange={({ value }) => setAnswerType(value as AnswerType)}
        gap="1.2em"
      >
        <Input
          id="answerType"
          name="answerType"
          hidden={true}
          value={answerType}
        />
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
            value="true/false"
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
        id="hint"
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
        <Input name="hint" />
      </Field>
      {answerType === "open-ended" && (
        <Field id="answer" label="Answer" required={true}>
          <Textarea name="answer" />
        </Field>
      )}
    </Stack>
  );
}
