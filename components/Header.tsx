import { domine } from "@/fonts";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { signOut } from "@/auth";

export default function Header({ withLogo = true }: { withLogo?: boolean }) {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      {withLogo && (
        <Link
          href="/home"
          {...domine}
          fontSize="clamp(2rem, 3vw, 3.625rem)"
          fontWeight="bold"
          color="primary"
          textDecoration="none"
        >
          Elearner
        </Link>
      )}
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
