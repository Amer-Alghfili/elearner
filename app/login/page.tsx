"use client";

import { GoogleIcon, OutlookIcon } from "@/components/Icons";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import React from "react";

export default function LoginPage() {
  return (
    <Box
      h="100%"
      pt="9.125em"
      bgGradient="linear-gradient(127deg, rgba(255, 191, 84, 0.8) 0%, rgba(65, 41, 0, 0.8) 100%)"
    >
      <Box maxW="38.625em" mx="auto">
        <Stack mb="5.25em" alignItems="center">
          <Heading as="h1">Welcome to Elearner</Heading>
          <Box>You’re about one step to improve your learning!</Box>
        </Stack>
        <Stack gap="1.875em">
          <Button
            bg="#986D00"
            variant="plain"
            borderColor="rgba(255, 243, 218, 0.6)"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button
            bg="#986D00"
            variant="plain"
            borderColor="rgba(255, 243, 218, 0.6)"
          >
            <OutlookIcon />
            Continue with Outlook
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
