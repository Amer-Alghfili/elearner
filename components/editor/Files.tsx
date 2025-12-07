import { File } from "@/app/learns/[id]/notes/page";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  LinkBox,
  LinkOverlay,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import AddButton from "../button/add";
import React from "react";
import { deleteFile, postFile } from "./actions";
import { useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";

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
      bg="primary.thick"
      py="1.5em"
      px="1em"
      borderRadius="8px"
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
                onClick={() => viewContent(file)}
                color="white"
                borderRadius="none"
                justifyContent="space-between"
                mx="-1em"
                px="1.5em"
                _hover={{
                  bg: "primary",
                }}
                bg={isActive ? "primary" : "transparent"}
              >
                <Flex>
                  {file.emoji != null && <Box>{file.emoji}</Box>}
                  <LinkOverlay>{file.title}</LinkOverlay>
                </Flex>
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
  const [formState, action, loading] = React.useActionState(postFile, {});
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
      <Input id="title" name="title" value="" hidden={true} />
      <Input id="learnId" name="learnId" value={learnId} hidden={true} />
      <AddButton
        type="submit"
        loading={loading}
        color="white"
        textStyle="h5"
        _hover={{ color: "stroke" }}
        iconProps={{
          fill: "white",
          stroke: "white",
          _groupHover: {
            fill: "primary.thick",
            stroke: "primary.thick",
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
    <form action={action}>
      <Input id="id" name="id" value={id} hidden={true} />
      <IconButton
        className="group"
        bg="transparent"
        loading={loading}
        type="submit"
      >
        <Icon
          transition="all 0.2s ease-in-out"
          _groupHover={{ stroke: "stroke" }}
        >
          <LuTrash />
        </Icon>
      </IconButton>
    </form>
  );
}
