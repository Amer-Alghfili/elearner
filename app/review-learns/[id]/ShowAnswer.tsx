import { Box, Button, Heading, Stack } from "@chakra-ui/react";

export function ShowAnswer({
  answer,
  open,
  onClose,
}: {
  answer: string;
  open: boolean;
  onClose: VoidFunction;
}) {
  const width = open ? "40vw" : 0;

  return (
    <Box
      bg="neutral.background"
      position="fixed"
      right={0}
      top={0}
      bottom={0}
      overflow="auto"
      w={width}
      borderInlineStartWidth="1px"
      borderInlineStartColor="stroke"
      transition="width 0.3s ease-in-out"
    >
      <Stack py="3em" px="2em" justifyContent="space-between" h="full">
        <Stack>
          <Heading as="h2">Answer</Heading>
          {answer}
        </Stack>
        <Button variant="secondary" onClick={onClose} alignSelf="flex-start">
          Close
        </Button>
      </Stack>
    </Box>
  );
}
