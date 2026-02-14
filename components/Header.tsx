import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { logout } from "@/auth";
import { Logo } from "./Logo";
import { Alert } from "./ui/alert";
import { FaRegLightbulb } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";

export default function Header({
  withLogo = true,
  knowledgeItemsCount = 0,
}: {
  withLogo?: boolean;
  knowledgeItemsCount?: number;
}) {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      {withLogo && <Logo />}
      {knowledgeItemsCount > 0 && (
        <Alert
          status="warning"
          title="You have pending items to review"
          icon={<FaRegLightbulb />}
          alignItems="center"
          endElement={
            <IconButton variant="plain">
              <LuExternalLink />
            </IconButton>
          }
        />
      )}
      <Box ms="auto">
        <form action={logout}>
          <Button
            type="submit"
            variant="plain"
            color="primary"
            fontWeight="bold"
          >
            <ExitIcon />
            Logout
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
