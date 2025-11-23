import { auth } from "@/auth";
import { EditIcon } from "@/components/Icons";
import { prisma } from "@/prisma";
import { Button, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";

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
  return learns.map(({ id, title, description }) => {
    return (
      <Card.Root key={id} w="full">
        <Card.Body>
          <Stack gap={0}>
            <Flex alignItems="center" gap="1em" justifyContent="space-between">
              <Heading as="h4">{title}</Heading>
              <Button
                variant="plain"
                p={0}
                _hover={{ bg: "rgb(152, 109, 0, 0.2)" }}
              >
                <EditIcon w="24px" h="24px" />
              </Button>
            </Flex>
            <Text maxW="31.25rem">{description}</Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  });
}
