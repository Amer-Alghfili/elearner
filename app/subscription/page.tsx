import axios from "axios";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { SubscribeButton } from "./SubscribeButton";
import {
  Box,
  Stack,
  HStack,
  Flex,
  Text,
  Button,
  Table,
} from "@chakra-ui/react";

interface PaddleSubscription {
  id: string;
  status: string;
  started_at: string;
  current_billing_period?: {
    starts_at: string;
    ends_at: string;
  };
  next_billed_at?: string;
  canceled_at?: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "canceled":
      return "Cancelled";
    case "past_due":
      return "Past due";
    case "paused":
      return "Paused";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export default async function Page() {
  const authData = await auth();
  const email = authData?.user?.email;
  if (!email) return;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  let paddleId: string | null | undefined = user?.paddleId;

  if (paddleId == null) {
    try {
      const {
        data: { data },
      } = await axios.post(
        `${process.env.PADDLE_API_URL}/customers`,
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          },
        },
      );

      paddleId = data.id;

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          paddleId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  let priceId: string | null = null;
  let priceAmount: string | null = null;

  try {
    const pricesRes = await fetch(`${process.env.PADDLE_API_URL}/prices`, {
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      },
      cache: "no-store",
    });

    if (pricesRes.ok) {
      const { data } = await pricesRes.json();
      const firstPrice = data?.[0];
      priceId = firstPrice?.id ?? null;
      const rawAmount = firstPrice?.unit_price?.amount;
      if (rawAmount != null) {
        priceAmount = (Number(rawAmount) / 100).toFixed(2);
      }
    }
  } catch (err) {
    console.log(err);
  }

  let activeSub: PaddleSubscription | null = null;
  let historySubs: PaddleSubscription[] = [];

  if (paddleId) {
    try {
      const res = await fetch(
        `${process.env.PADDLE_API_URL}/subscriptions?customer_id=${paddleId}&order_by=id[DESC]`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          },
          cache: "no-store",
        },
      );

      if (res.ok) {
        const { data } = await res.json();
        activeSub =
          data.find(
            (sub: PaddleSubscription) =>
              sub.status === "active" || sub.status === "trialing",
          ) ?? null;
        historySubs = data.filter(
          (sub: PaddleSubscription) =>
            sub.status !== "active" && sub.status !== "trialing",
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  const premiumFeatures = [
    "Unlimited learns",
    "Unlimited notebooks",
    "Unlimited flashcards",
    "Unlimited resources",
  ];

  const now = new Date();
  let subProgress = 0;
  if (activeSub?.current_billing_period) {
    const start = new Date(activeSub.started_at).getTime();
    const end = new Date(activeSub.current_billing_period.ends_at).getTime();
    subProgress = Math.min(
      100,
      Math.max(0, ((now.getTime() - start) / (end - start)) * 100),
    );
  }

  return (
    <Scaffold>
      <Header />
      <Stack mt="4em" gap="2em">
        {/* Section 1: Current Subscription */}
        <Text textStyle="h3" color="text.primary">
          Subscription
        </Text>

        {activeSub ? (
          <Box border="1px solid" borderColor="stroke" rounded="xl" p="6">
            <Stack gap="3em">
              <Stack>
                <HStack gap="2">
                  <Text color="text.primary" fontWeight="medium">
                    Current Plan:
                  </Text>
                  <Box px="3" py="0.5" rounded="full" bg="rgba(152,109,0,0.12)">
                    <Text textStyle="sm-semibold" color="primary">
                      Premium
                    </Text>
                  </Box>
                </HStack>
                {activeSub.next_billed_at && (
                  <Text textStyle="sm" color="text.secondary">
                    Renews at: {formatDate(activeSub.next_billed_at)}
                  </Text>
                )}
              </Stack>

              <Stack gap="2">
                {activeSub.current_billing_period && (
                  <Box
                    w="full"
                    h="6px"
                    bg="stroke"
                    rounded="full"
                    overflow="hidden"
                  >
                    <Box
                      h="full"
                      bg="primary"
                      rounded="full"
                      style={{ width: `${subProgress}%` }}
                    />
                  </Box>
                )}
                <Flex justifyContent="space-between">
                  <Stack gap="0">
                    <Text textStyle="sm" color="text.caption">
                      Started at
                    </Text>
                    <Text textStyle="sm" color="text.primary">
                      {formatDate(activeSub.started_at)}
                    </Text>
                  </Stack>
                  {activeSub.current_billing_period && (
                    <Stack gap="0">
                      <Text textStyle="sm" color="text.caption">
                        End at
                      </Text>
                      <Text textStyle="sm" color="text.primary">
                        {formatDate(activeSub.current_billing_period.ends_at)}
                      </Text>
                    </Stack>
                  )}
                </Flex>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Stack gap="4">
            <Text color="text.secondary">
              You don&apos;t have any active subscription
            </Text>

            <Box
              border="1.5px solid"
              borderColor="primary"
              rounded="xl"
              p="6"
              bg="rgba(152,109,0,0.05)"
            >
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Stack gap="3">
                  <Text textStyle="h5" color="text.primary" fontWeight="bold">
                    Premium Plan
                  </Text>
                  <Stack gap="1.5">
                    {premiumFeatures.map((f) => (
                      <HStack key={f} gap="2">
                        <Box
                          flexShrink={0}
                          w="6px"
                          h="6px"
                          rounded="full"
                          bg="primary"
                        />
                        <Text textStyle="sm" color="text.secondary">
                          {f}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                  <SubscribeButton
                    env={process.env.PADDLE_ENV as "production" | "sandbox"}
                    token={process.env.PADDLE_CLIENT_TOKEN as string}
                    email={email}
                    paddleId={paddleId}
                    priceId={priceId}
                  />
                </Stack>
                <Stack gap="0" alignItems="flex-end">
                  <Text textStyle="h3" color="text.primary" fontWeight="bold">
                    {priceAmount != null ? `$${priceAmount}/` : null}
                  </Text>
                  <Text textStyle="sm" color="text.caption">
                    Monthly
                  </Text>
                </Stack>
              </Flex>
            </Box>
          </Stack>
        )}

        {/* Section 2: Previous subscriptions */}
        {historySubs.length > 0 && (
          <Stack gap="2em" mt="4em">
            <Text textStyle="h3" color="text.primary">
              Previous subscriptions
            </Text>
            <Table.Root variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Plan</Table.ColumnHeader>
                  <Table.ColumnHeader>Started at</Table.ColumnHeader>
                  <Table.ColumnHeader>Ended at</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {historySubs.map((sub) => (
                  <Table.Row key={sub.id}>
                    <Table.Cell>Premium</Table.Cell>
                    <Table.Cell>{formatDate(sub.started_at)}</Table.Cell>
                    <Table.Cell>
                      {sub.canceled_at
                        ? formatDate(sub.canceled_at)
                        : sub.current_billing_period
                          ? formatDate(sub.current_billing_period.ends_at)
                          : "—"}
                    </Table.Cell>
                    <Table.Cell>{getStatusLabel(sub.status)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Stack>
        )}
      </Stack>
    </Scaffold>
  );
}
