"use client";

import { GoogleIcon, OutlookIcon } from "@/components/Icons";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Input,
  Link,
} from "@chakra-ui/react";

export default function SignupPage() {
  return (
    <Box
      minH="100vh"
      pt="5em"
      bgGradient="linear-gradient(127deg, rgba(255, 191, 84, 0.8) 0%, rgba(65, 41, 0, 0.8) 100%)"
    >
      <Box maxW="38.625em" mx="auto">
        <Stack mb="5.25em" alignItems="center">
          <Heading as="h1">Welcome to Elearner</Heading>
          <Box fontSize="1.25rem" fontWeight="medium">
            You’re about one step to improve your learning!
          </Box>
        </Stack>
        <Stack gap="1.875em">
          <Button variant="primary" borderColor="rgba(255, 243, 218, 0.6)">
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
        <Divider />
        <Stack gap="2.625em">
          <Stack gap="1.875em">
            <Field label="Email">
              <Input size="lg" placeholder="e.g a@a.com" bg="primary.thin" />
            </Field>
            <Field label="Password">
              <PasswordInput
                size="lg"
                placeholder="at least 8 characters"
                bg="primary.thin"
              />
            </Field>
          </Stack>
          <Stack gap="1em">
            <Button variant="primary" borderColor="rgba(255, 243, 218, 0.6)">
              Sign up
            </Button>
            <Box textAlign="center" color="stroke" textStyle="md-bold">
              Already have an account?{" "}
              <Link href="/login" color="white">
                Sign In
              </Link>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function Divider() {
  return (
    <Flex mt="3.0625em" mb="1.8125em" alignItems="center" gap="0.75em">
      <Box h="1px" flex="100%" bg="white" />
      <Box>OR</Box>
      <Box h="1px" flex="100%" bg="white" />
    </Flex>
  );
}
