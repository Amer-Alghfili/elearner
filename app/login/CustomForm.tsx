"use client";

import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Box, Button, Stack, Input, Link } from "@chakra-ui/react";
import React from "react";
import { authenticate } from "../lib/actions";
import { toaster } from "@/components/ui/toaster";

export function CustomForm() {
  const [errorMessage, formAction, isPending] = React.useActionState(
    authenticate,
    undefined
  );

  React.useEffect(
    function toastError() {
      if (errorMessage) {
        toaster.create({
          title: errorMessage,
          type: "error",
          closable: true,
        });
      }
    },
    [errorMessage]
  );

  return (
    <form action={formAction}>
      <Stack gap="2.625em">
        <Stack gap="1.875em">
          <Field label="Email">
            <Input
              id="email"
              name="email"
              size="lg"
              placeholder="e.g a@a.com"
              bg="primary.thin"
            />
          </Field>
          <Field label="Password">
            <PasswordInput
              id="password"
              name="password"
              size="lg"
              placeholder="at least 8 characters"
              bg="primary.thin"
            />
          </Field>
        </Stack>

        <input type="hidden" name="redirectTo" value="/" />
        <Stack gap="1em">
          <Button
            type="submit"
            variant="primary"
            borderColor="rgba(255, 243, 218, 0.6)"
            aria-disabled={isPending}
          >
            Sign in
          </Button>
          <Box textAlign="center" color="stroke" textStyle="md-bold">
            You don’t have an account?{" "}
            <Link href="/signup" color="white">
              Sign Up
            </Link>
          </Box>
        </Stack>
      </Stack>
    </form>
  );
}
