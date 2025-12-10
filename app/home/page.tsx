import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { Stack } from "@chakra-ui/react";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import LearnsContainer from "./LearnsContainer";

export default async function HomePage() {
  const data = await auth();

  const learns = await prisma.learn.findMany({
    where: {
      user_id: data?.user?.email as string,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Scaffold>
      <Header />
      <Stack mt="6.4375em" alignItems="flex-start" gap="2em">
        <LearnsContainer learns={learns} />
      </Stack>
    </Scaffold>
  );
}
