import { Scaffold } from "@/components/Scaffold";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import { Box, Button, Flex, Heading, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

export default function ReviewLearnPage() {
  return (
    <Scaffold h="100vh">
      <Box as="form" h="full" maxW="40em" m="auto">
        <Stack justifyContent="space-between" h="full" py="4em">
          <ProgressRoot value={20} w="100%">
            <Stack gap="0.5em">
              <ProgressBar />
              <ProgressValueText>2 of 10</ProgressValueText>
            </Stack>
          </ProgressRoot>
          <Stack gap="3em">
            <Heading as="h2" textAlign="center">
              What is X ?
            </Heading>
            <Stack gap="1em">
              <Flex w="full" gap="1em">
                <Button variant="secondary" flex="100%">
                  💡 Hint
                </Button>
                <Button variant="secondary" flex="100%">
                  Show Answer
                </Button>
              </Flex>
              <Textarea h="8em" />
            </Stack>
          </Stack>
          <Flex gap="3em" justifyContent="space-between">
            <Button variant="secondary" w="30%">
              Previous
            </Button>
            <Button w="30%">Next</Button>
          </Flex>
        </Stack>
      </Box>
    </Scaffold>
  );
}
