"use client";

import { signIn } from "@/auth";
import { GoogleIcon, OutlookIcon } from "@/components/Icons";
import { Button, Stack } from "@chakra-ui/react";

export function ProvidersAuth() {
  return (
    <Stack gap="1.875em">
      <Button
        onClick={() => signIn("google", { redirectTo: "/home" })}
        variant="primary"
        borderColor="rgba(255, 243, 218, 0.6)"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button variant="primary" borderColor="rgba(255, 243, 218, 0.6)">
        <OutlookIcon />
        Continue with Outlook
      </Button>
    </Stack>
  );
}
