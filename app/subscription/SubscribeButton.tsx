"use client";

import React from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export function SubscribeButton({
  env,
  token,
  email,
  paddleId,
  priceId,
}: {
  env: "sandbox" | "production";
  token: string;
  email: string;
  paddleId: string | null | undefined;
  priceId: string | null;
}) {
  const [paddle, setPaddle] = React.useState<Paddle | undefined>();

  const router = useRouter();

  const initialize = React.useEffectEvent(
    (
      env: "production" | "sandbox",
      email: string,
      paddleId: string,
      token: string,
    ) => {
      initializePaddle({
        environment: env,
        token,
        pwCustomer: { email, id: paddleId ?? undefined },
        eventCallback: (e) => {
          if (e.code === "checkout.completed") router.refresh();
        },
        checkout: {
          settings: { displayMode: "overlay", successUrl: "/subscription" },
        },
      }).then(setPaddle);
    },
  );

  React.useEffect(
    () => initialize(env, email, paddleId as string, token),
    [env, email, paddleId, token],
  );

  return (
    <Button
      mt="1"
      alignSelf="flex-start"
      _hover={{ bg: "primary.thick" }}
      disabled={paddle == null}
      onClick={() =>
        paddle?.Checkout.open({
          customer: paddleId == null ? { email } : { id: paddleId },
          items: priceId ? [{ priceId, quantity: 1 }] : [],
        })
      }
    >
      Subscribe now
    </Button>
  );
}
