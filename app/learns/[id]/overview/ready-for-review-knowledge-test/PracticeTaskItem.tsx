import { Button, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { updateDueDate } from "../../_practice-task-form/actions";
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
  ElearnerNoteEditor,
  useElearnerCreateBlockNote,
} from "@/components/ElearnerNoteEditor";
import { useController, useForm } from "react-hook-form";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { PracticeTask } from "../../_practice-task-form/types";

export function PracticeTaskItem({
  practiceTask,
}: {
  practiceTask: PracticeTask;
}) {
  const { title, description } = practiceTask;

  const [open, setOpen] = React.useState(false);
  const [flip, setFlip] = React.useState(false);

  const router = useRouter();

  const editor = useElearnerCreateBlockNote({
    initialContent: null,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<PracticeTask>({
    defaultValues: {
      ...practiceTask,
      stage: null,
    },
  });

  const { field } = useController({
    control,
    name: "stage",
  });

  async function finishReview(practiceTask: PracticeTask) {
    if (practiceTask.stage == null) {
      toaster.create({
        title: "Please select a stage",
        type: "error",
        closable: true,
      });

      return;
    }

    try {
      await updateDueDate(practiceTask.id, Number(practiceTask.stage));

      toaster.create({
        title: "You have reviewed Practice Task, keep going",
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

  React.useEffect(
    function convertHtmlToBlocks() {
      const blocks = editor.tryParseHTMLToBlocks(description);
      editor.replaceBlocks(editor.document, blocks);
    },
    [description]
  );

  const front = (
    <Stack
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
    >
      <DialogBody overflow={!flip ? "auto" : "visible"}>
        <Flex justifyContent="center">
          <ElearnerNoteEditor editor={editor} editable={false} />
        </Flex>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogActionTrigger>
        <Button onClick={() => setFlip((prev) => !prev)}>Finish</Button>
      </DialogFooter>
    </Stack>
  );

  const nextStage =
    practiceTask.stage === "4"
      ? "4"
      : `${Number(practiceTask.stage as string) + 1}`;

  const back = (
    <Stack
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backfaceVisibility="hidden"
      transform="rotateY(180deg)"
    >
      <DialogBody overflow={flip ? "auto" : "visible"}>
        <Stack h="full" justifyContent="center" alignItems="center" gap="3em">
          <Heading as="h3">What&apos;s Next ?</Heading>
          <Text textStyle="md-medium" color="text.secondary">
            What do you want to do with this practice task ?
          </Text>
          <RadioCardRoot
            gap="1em"
            onValueChange={({ value }) => field.onChange(value)}
          >
            <RadioCardItem
              value={nextStage}
              label={
                <Stack>
                  <Text>
                    I did great, move it to next stage (#
                    {nextStage})
                  </Text>
                </Stack>
              }
            />
            <RadioCardItem
              value={`${practiceTask.stage}`}
              label={
                <Stack>
                  <Text>
                    Need further review, keep it in the current stage (#
                    {Number(practiceTask.stage)})
                  </Text>
                </Stack>
              }
            />
          </RadioCardRoot>
        </Stack>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setFlip((prev) => !prev)} variant="secondary">
          Flip Back
        </Button>
        <form onSubmit={handleSubmit(finishReview)}>
          <Button loading={isSubmitting} type="submit">
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
          {title}
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
