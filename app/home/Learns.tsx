import { EditIcon } from "@/components/Icons";
import {
  Button,
  Card,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { Learn } from "./actions";

export function Learns({ learns }: { learns: Learn[] }) {
  //TODO: recently created learn doesn't rendered
  return learns.map(({ id, title }) => (
    <LinkBox key={id} w="full">
      <Card.Root>
        <Card.Body>
          <Stack gap={0}>
            <Flex alignItems="center" gap="1em" justifyContent="space-between">
              <Heading as="h4">
                <LinkOverlay href={`/learns/${id}/overview`}>
                  {title}
                </LinkOverlay>
              </Heading>
              {/* TODO: edit learn modal */}
              <Button
                variant="plain"
                p={0}
                _hover={{ bg: "rgb(152, 109, 0, 0.2)" }}
              >
                <EditIcon w="24px" h="24px" />
              </Button>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>
    </LinkBox>
  ));
}
