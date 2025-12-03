import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { LayoutTabs } from "./LayoutTabs";
import { Scaffold } from "@/components/Scaffold";
import Header from "@/components/Header";
import { Box, Stack } from "@chakra-ui/react";

export default async function LearnDetailsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  const session = await auth();

  //TODO: unauthorized
  if (session?.user?.email == null) return "unauthorized auth";

  const { email } = session.user;

  const learn = await prisma.learn.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      todos: true,
      resources: true,
    },
  });

  //TODO: unauthorized
  if (learn?.user_id !== email) return "unauthorized learn";

  return (
    <Scaffold>
      <Header />
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
    </Scaffold>
  );
}
