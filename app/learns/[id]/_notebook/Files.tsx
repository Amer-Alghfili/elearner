import {
  Button,
  Icon,
  Input,
  LinkBox,
  LinkOverlay,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import AddButton from "../../../../components/button/add";
import React from "react";
import { deleteFile, createFile } from "./actions";
import { useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";
import RemoveButton from "../../../../components/button/remove";
import { File } from ".";

export function Files({
  learnId,
  files,
  activeFile,
  viewContent,
  ...rest
}: {
  learnId: number;
  files: File[];
  activeFile: File["id"] | null;
  viewContent: (file: File) => void;
} & StackProps) {
  return (
    <Stack
      borderWidth="1px"
      borderColor="stroke"
      py="1.5em"
      px="1em"
      gap="1em"
      {...rest}
    >
      <CreateFile learnId={learnId} />
      <Stack>
        {files.map((file) => {
          const isActive = file.id === activeFile;

          return (
            <LinkBox key={file.id} asChild>
              <Button
                variant="plain"
                borderRadius="none"
                justifyContent="space-between"
                mx="-1em"
                px="1.5em"
                _hover={{
                  bg: "stroke.transparent",
                }}
                color={isActive ? "primary" : "text.primary"}
                bg={isActive ? "primary.transparent" : "none"}
                fontWeight={isActive ? "extrabold" : "semibold"}
              >
                <LinkOverlay
                  onClick={() => viewContent(file)}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {file.title}
                </LinkOverlay>
                <RemoveFile id={file.id} />
              </Button>
            </LinkBox>
          );
        })}
      </Stack>
    </Stack>
  );
}

function CreateFile({ learnId }: { learnId: number }) {
  const [formState, action, loading] = React.useActionState(createFile, {});
  const { error } = formState;

  const router = useRouter();

  React.useEffect(
    function reload() {
      if (error) return;

      router.refresh();
    },
    [formState.data]
  );

  return (
    <form action={action}>
      <Input id="title" name="title" value="" hidden={true} readOnly={true} />
      <Input
        id="learnId"
        name="learnId"
        value={learnId}
        hidden={true}
        readOnly={true}
      />
      <AddButton
        type="submit"
        loading={loading}
        textStyle="h5"
        color="text.primary"
        w="full"
        justifyContent="flex-start"
        _hover={{ bg: "stroke.transparent" }}
        iconProps={{
          fill: "text.primary",
          stroke: "text.primary",
          _groupHover: {
            fill: "text.secondary",
            stroke: "text.secondary",
          },
        }}
        alignSelf="flex-start"
      >
        Files
      </AddButton>
    </form>
  );
}

function RemoveFile({ id }: { id: number }) {
  const [formState, action, loading] = React.useActionState(deleteFile, {});

  const router = useRouter();

  React.useEffect(
    function reload() {
      router.refresh();
    },
    [formState.data]
  );

  return (
    <RemoveButton
      className="group"
      _hover={{ bg: "stroke" }}
      icon={
        <Icon
          transition="all 0.2s ease-in-out"
          stroke="text.secondary"
          _groupHover={{ stroke: "text.primary" }}
        >
          <LuTrash />
        </Icon>
      }
    >
      <form action={action}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" loading={loading} bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}
