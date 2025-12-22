"use client";

import { signIn } from "@/auth";
import { GoogleIcon } from "@/components/Icons";
import { Button } from "@chakra-ui/react";

export function ProvidersAuth() {
  return (
    <Button
      onClick={() => signIn("google", { redirectTo: "/home" })}
      variant="primary"
      borderColor="rgba(255, 243, 218, 0.6)"
      w="full"
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
