"use client";

import React from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Button } from "@chakra-ui/react";

export function ClientPage({
  env,
  token,
  email,
  id,
}: {
  env: "sandbox" | "production";
  token: string;
  email: string;
  id: string | null | undefined;
}) {
  const [paddle, setPaddle] = React.useState<Paddle | undefined>();

  React.useEffect(() => {
    async function initialize() {
      const paddle = await initializePaddle({
        environment: env,
        token,
        pwCustomer: {
          email,
          id: id as string | undefined,
        },
        checkout: {
          settings: {
            displayMode: "inline",
            successUrl: "/home",
          },
        },
      });

      setPaddle(paddle);
    }

    initialize();
  }, [env, email, id, token]);

  if (paddle == null) return <h1>loading...</h1>;
  if (!paddle.Initialized) return <h1>Something went wrong</h1>;

  return (
    <Button
      onClick={() => {
        paddle.Checkout.open({
          customer: id == null ? { email } : { id },
          items: [
            {
              priceId: "pri_01kpz2znnec6jqff3wdbfycrv4",
              quantity: 1,
            },
          ],
        });
      }}
    >
      Go to Checkout
    </Button>
  );
}
