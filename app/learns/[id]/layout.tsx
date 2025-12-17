import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { LayoutTabs } from "./LayoutTabs";
import { Scaffold } from "@/components/Scaffold";
import Header from "@/components/Header";
import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Empty } from "@/components/empty-state/Empty";

export default async function LearnDetailsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  const session = await auth();

  const email = session?.user?.email;

  const learn = await prisma.learn.findFirst({
    where: {
      id: Number(id),
      user_id: email as string,
    },
  });

  return (
    <Scaffold>
      <Header />
      {learn == null ? (
        <Stack w="full" gap={0} alignItems="center">
          <Empty />
          <Stack gap="0.5em" alignItems="center">
            <Heading as="h3" color="text.primary">
              Learn is not Found!
            </Heading>
            <Text color="text.secondary">
              The learn you are looking for is not found
            </Text>
            <Button asChild mt="1.2em">
              <Link href="/home" textDecoration="none">
                Go to home page
              </Link>
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack mt="3rem" gap="2em">
          <Stack gap={0}>
            <Box textStyle="h2" color="text.primary">
              {learn.title}
            </Box>
            <Box textStyle="lg" color="text.secondary" lineHeight="0.8">
              {learn.description}
            </Box>
          </Stack>
          <LayoutTabs>{children}</LayoutTabs>
        </Stack>
      )}
    </Scaffold>
  );
}
