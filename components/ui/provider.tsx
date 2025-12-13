"use client";

import { Box, ChakraProvider, Heading, Stack, Text } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "@/theme";
import { Offline } from "react-detect-offline";
import { Tooltip } from "./tooltip";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <Offline>
        <Box position="fixed" top={2} insetStart={2}>
          <Tooltip
            openDelay={100}
            contentProps={{ bg: "neutral.surface", py: "0.4em", px: "1em" }}
            content={
              <Stack bg="neutral.surface" color="text.secondary" p="0.5em">
                <Heading as="h5">You are offline now</Heading>
                <Text>Please try to reconnect in order to avoid data loss</Text>
              </Stack>
            }
          >
            <Box
              bg="neutral.surface"
              color="text.secondary"
              borderWidth="1px"
              borderColor="stroke"
              textStyle="sm-bold"
              py="0.2em"
              px="0.6em"
              borderRadius="14px"
            >
              Offline
            </Box>
          </Tooltip>
        </Box>
      </Offline>
      <ColorModeProvider forcedTheme="light" {...props} />
    </ChakraProvider>
  );
}
