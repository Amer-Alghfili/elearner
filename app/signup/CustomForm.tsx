"use client";

import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { Box, Button, Stack, Input, Link } from "@chakra-ui/react";
import React from "react";
import { authenticateSignup } from "../lib/actions";
import { useRouter } from "next/navigation";

export function CustomForm() {
  const router = useRouter();

  const [state, formAction, isPending] = React.useActionState(
    authenticateSignup,
    undefined
  );

  React.useEffect(
    function toastError() {
      if (!state) return;

      if (state == "success") {
        toaster.create({
          title: "Account has been created successfully 🎉",
          type: "success",
          closable: true,
        });

        router.push("/home");
      } else {
        toaster.create({
          title: state,
          type: "error",
          closable: true,
        });
      }
    },
    [state]
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
        <input type="hidden" name="redirectTo" value="/home" />
        <Stack gap="1em">
          <Button
            type="submit"
            variant="primary"
            borderColor="rgba(255, 243, 218, 0.6)"
            aria-disabled={isPending}
          >
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
    </form>
  );
}
