"use client";

import { Box, Stack } from "@chakra-ui/react";
import { Create } from "./Create";

export function Container({ learnId }: { learnId: number }) {
  return (
    <Stack>
      <Create learnId={learnId} />
      <Box>List</Box>
    </Stack>
  );
}
