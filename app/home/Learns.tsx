import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Box, Stack } from "@chakra-ui/react";

export async function Learns() {
  const data = await auth();

  //TODO: unauthorized
  if (data == null || data.user == null) return;

  const learns = await prisma.learns.findMany({
    where: {
      user_id: data?.user?.email as string,
    },
  });

  //TODO: empty state
  return learns.map((learn) => {
    return (
      <Stack key={learn.id}>
        <Box>{learn.title}</Box>
        <Box>{learn.description}</Box>
      </Stack>
    );
  });
}
