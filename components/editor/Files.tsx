import { File } from "@/app/learns/[id]/notes/page";
import { Box, Button, Stack, StackProps } from "@chakra-ui/react";
import AddButton from "../button/add";

export function Files({
  files,
  activeFile,
  loading,
  viewContent,
  onCreate,
  ...rest
}: {
  files: File[];
  activeFile: File["id"] | null;
  loading: boolean;
  viewContent: (id: number) => void;
  onCreate: VoidFunction;
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
      <AddButton
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
        onClick={onCreate}
      >
        Files
      </AddButton>
      <Stack>
        {files.map((file) => {
          const isActive = file.id === activeFile;

          return (
            <Button
              key={file.id}
              variant="plain"
              onClick={() => viewContent(file.id)}
              color="white"
              borderRadius="none"
              justifyContent="flex-start"
              mx="-1em"
              px="1.5em"
              _hover={{
                bg: "primary",
              }}
              bg={isActive ? "primary" : "transparent"}
            >
              {file.emoji != null && <Box>{file.emoji}</Box>}
              <Box>{file.title}</Box>
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}
