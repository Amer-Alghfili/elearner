import { Box, Button, Flex } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { signOut } from "@/auth";
import { Logo } from "./Logo";

export default function Header({ withLogo = true }: { withLogo?: boolean }) {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      {withLogo && <Logo />}
      <Box ms="auto">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
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
